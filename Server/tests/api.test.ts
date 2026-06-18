import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const ownerDbUser = {
  id: "owner-db-id",
  supabaseUserId: "owner-sub",
  email: "owner@example.com",
  fullName: "Owner User",
  role: "owner",
  isActive: true,
};

const staffDbUser = {
  id: "staff-db-id",
  supabaseUserId: "staff-sub",
  email: "staff@example.com",
  fullName: "Staff User",
  role: "staff",
  isActive: true,
};

const mockPrisma = {
  $connect: vi.fn(),
  $disconnect: vi.fn(),
  $transaction: vi.fn(),
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    upsert: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  worker: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  workerDocument: {
    create: vi.fn(),
    updateMany: vi.fn(),
    count: vi.fn(),
  },
  workerReference: {
    create: vi.fn(),
    count: vi.fn(),
  },
  guarantor: {
    create: vi.fn(),
    count: vi.fn(),
  },
  employer: {
    findMany: vi.fn(),
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  jobRequest: {
    findMany: vi.fn(),
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  match: {
    deleteMany: vi.fn(),
    createMany: vi.fn(),
    findMany: vi.fn(),
  },
  placement: {
    findMany: vi.fn(),
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  auditLog: {
    create: vi.fn(),
  },
};

const mockSupabaseAdmin = {
  auth: {
    admin: {
      inviteUserByEmail: vi.fn(),
      createUser: vi.fn(),
      updateUserById: vi.fn(),
    },
  },
};

const mockSupabasePublic = {
  auth: {
    resetPasswordForEmail: vi.fn(),
  },
};

const mockCloudinary = {
  utils: {
    api_sign_request: vi.fn(),
    verify_api_response_signature: vi.fn(),
  },
  uploader: {
    destroy: vi.fn(),
  },
};

const jwtVerifyMock = vi.fn();

vi.mock("../src/lib/prisma.js", () => ({
  prisma: mockPrisma,
}));

vi.mock("../src/lib/supabase.js", () => ({
  supabaseAdmin: mockSupabaseAdmin,
  supabasePublic: mockSupabasePublic,
}));

vi.mock("../src/config/cloudinary.js", () => ({
  cloudinary: mockCloudinary,
}));

vi.mock("jose", () => ({
  createRemoteJWKSet: vi.fn(() => ({})),
  jwtVerify: jwtVerifyMock,
}));

const { app } = await import("../src/app.js");

const authHeader = (token = "owner-token") => ({
  Authorization: `Bearer ${token}`,
});

describe("SkillBridge API endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    jwtVerifyMock.mockImplementation(async (token: string) => {
      if (token === "owner-token") {
        return {
          payload: {
            sub: "owner-sub",
            email: "owner@example.com",
            user_metadata: { full_name: "Owner User" },
          },
        };
      }

      return {
        payload: {
          sub: "staff-sub",
          email: "staff@example.com",
          user_metadata: { full_name: "Staff User" },
        },
      };
    });

    mockPrisma.$transaction.mockImplementation(async (callback: (tx: typeof mockPrisma) => unknown) =>
      callback(mockPrisma),
    );

    mockPrisma.user.findUnique.mockImplementation(async ({ where }: { where: { supabaseUserId?: string; id?: string } }) => {
      if (where.supabaseUserId === "owner-sub" || where.id === "owner-db-id") return ownerDbUser;
      if (where.supabaseUserId === "staff-sub" || where.id === "staff-db-id") return staffDbUser;
      return null;
    });

    mockPrisma.user.findMany.mockResolvedValue([ownerDbUser, staffDbUser]);
    mockPrisma.user.upsert.mockImplementation(async ({ create }: { create: typeof ownerDbUser }) => create);
    mockPrisma.user.update.mockImplementation(async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => ({
      ...(where.id === "staff-db-id" ? staffDbUser : ownerDbUser),
      ...data,
    }));
    mockPrisma.auditLog.create.mockResolvedValue({ id: "audit-1" });

    mockPrisma.worker.findMany.mockResolvedValue([
      {
        id: "worker-1",
        fullName: "Jane Worker",
        phone: "08000000000",
        location: "Lagos",
        availabilityStatus: "available",
        verificationStatus: "verified",
        roles: [{ roleType: "nanny" }],
        documents: [],
      },
    ]);
    mockPrisma.worker.findFirst.mockResolvedValue(null);
    mockPrisma.worker.create.mockResolvedValue({
      id: "worker-1",
      fullName: "Jane Worker",
      phone: "08000000000",
      location: "Lagos",
      availabilityStatus: "available",
      verificationStatus: "draft",
      roles: [{ roleType: "nanny" }],
      documents: [],
      references: [],
      guarantors: [],
      placements: [],
    });
    mockPrisma.worker.findUnique.mockResolvedValue({
      id: "worker-1",
      fullName: "Jane Worker",
      phone: "08000000000",
      location: "Lagos",
      availabilityStatus: "available",
      verificationStatus: "draft",
      nin: "12345678901",
      bvn: "12345678901",
      roles: [{ roleType: "nanny" }],
      documents: [],
      references: [],
      guarantors: [],
      placements: [],
    });
    mockPrisma.worker.update.mockImplementation(async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => ({
      id: where.id,
      fullName: "Jane Worker",
      phone: "08000000000",
      location: "Lagos",
      nin: "12345678901",
      bvn: "12345678901",
      ...data,
    }));
    mockPrisma.worker.count.mockResolvedValue(10);

    mockPrisma.workerDocument.create.mockResolvedValue({ id: "doc-1", workerId: "worker-1" });
    mockPrisma.workerDocument.updateMany.mockResolvedValue({ count: 1 });
    mockPrisma.workerDocument.count.mockResolvedValue(1);
    mockPrisma.workerReference.create.mockResolvedValue({ id: "ref-1", workerId: "worker-1" });
    mockPrisma.workerReference.count.mockResolvedValue(1);
    mockPrisma.guarantor.create.mockResolvedValue({ id: "gua-1", workerId: "worker-1" });
    mockPrisma.guarantor.count.mockResolvedValue(1);

    mockPrisma.employer.findMany.mockResolvedValue([{ id: "emp-1", name: "Client One", phone: "0801" }]);
    mockPrisma.employer.create.mockResolvedValue({ id: "emp-1", name: "Client One", type: "household", phone: "0801" });
    mockPrisma.employer.findUnique.mockResolvedValue({
      id: "emp-1",
      name: "Client One",
      type: "household",
      phone: "0801",
      jobRequests: [],
      placements: [],
    });
    mockPrisma.employer.update.mockResolvedValue({ id: "emp-1", name: "Client One Updated", type: "household", phone: "0801" });

    mockPrisma.jobRequest.findMany.mockResolvedValue([{ id: "req-1", employerId: "emp-1", roleType: "nanny", status: "new" }]);
    mockPrisma.jobRequest.create.mockResolvedValue({ id: "req-1", employerId: "emp-1", roleType: "nanny", status: "new" });
    mockPrisma.jobRequest.findUnique.mockResolvedValue({
      id: "req-1",
      employerId: "emp-1",
      roleType: "nanny",
      location: "Lagos",
      workArrangement: "live_in",
      employmentType: "full_time",
      status: "new",
      employer: { id: "emp-1", name: "Client One" },
      matches: [],
      placement: null,
    });
    mockPrisma.jobRequest.update.mockImplementation(async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => ({
      id: where.id,
      employerId: "emp-1",
      roleType: "nanny",
      status: "new",
      ...data,
    }));
    mockPrisma.jobRequest.count.mockResolvedValue(4);

    mockPrisma.match.deleteMany.mockResolvedValue({ count: 0 });
    mockPrisma.match.createMany.mockResolvedValue({ count: 1 });
    mockPrisma.match.findMany.mockResolvedValue([
      {
        id: "match-1",
        jobRequestId: "req-1",
        workerId: "worker-1",
        score: 90,
        matchReasonsJson: ["role_match", "verified", "available"],
        worker: {
          id: "worker-1",
          fullName: "Jane Worker",
          location: "Lagos",
          availabilityStatus: "available",
          verificationStatus: "verified",
          roles: [{ roleType: "nanny" }],
          documents: [],
        },
      },
    ]);

    mockPrisma.placement.findMany.mockResolvedValue([{ id: "pl-1", status: "active" }]);
    mockPrisma.placement.create.mockResolvedValue({
      id: "pl-1",
      jobRequestId: "req-1",
      workerId: "worker-1",
      employerId: "emp-1",
      status: "active",
      worker: { id: "worker-1" },
      employer: { id: "emp-1" },
      jobRequest: { id: "req-1" },
    });
    mockPrisma.placement.findUnique.mockResolvedValue({
      id: "pl-1",
      jobRequestId: "req-1",
      workerId: "worker-1",
      employerId: "emp-1",
      status: "active",
      worker: { id: "worker-1" },
      employer: { id: "emp-1" },
      jobRequest: { id: "req-1" },
    });
    mockPrisma.placement.update.mockImplementation(async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => ({
      id: where.id,
      jobRequestId: "req-1",
      workerId: "worker-1",
      employerId: "emp-1",
      status: "active",
      worker: { id: "worker-1" },
      employer: { id: "emp-1" },
      jobRequest: { id: "req-1" },
      ...data,
    }));
    mockPrisma.placement.count.mockResolvedValue(3);

    mockSupabaseAdmin.auth.admin.inviteUserByEmail.mockResolvedValue({
      data: { user: { id: "new-auth-user-id", email: "new@example.com" } },
      error: null,
    });
    mockSupabaseAdmin.auth.admin.createUser.mockResolvedValue({
      data: { user: { id: "password-auth-user-id", email: "new@example.com" } },
      error: null,
    });
    mockSupabaseAdmin.auth.admin.updateUserById.mockResolvedValue({
      data: { user: { id: "staff-sub" } },
      error: null,
    });
    mockSupabasePublic.auth.resetPasswordForEmail.mockResolvedValue({
      data: {},
      error: null,
    });

    mockCloudinary.utils.api_sign_request.mockReturnValue("signed-value");
    mockCloudinary.utils.verify_api_response_signature.mockReturnValue(true);
    mockCloudinary.uploader.destroy.mockResolvedValue({ result: "ok" });
  });

  it("covers the full Phase 1 API surface", async () => {
    await request(app).get("/api/v1/health").expect(200);

    await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: "owner@example.com" })
      .expect(200);

    await request(app)
      .post("/api/v1/auth/sync-user")
      .set(authHeader())
      .send({})
      .expect(200);

    await request(app).get("/api/v1/auth/me").set(authHeader()).expect(200);

    await request(app).get("/api/v1/users").set(authHeader()).expect(200);

    await request(app)
      .post("/api/v1/users")
      .set(authHeader())
      .send({
        fullName: "New Staff",
        email: "new@example.com",
        role: "staff",
        sendInvite: true,
      })
      .expect(201);

    await request(app).post("/api/v1/users/staff-db-id/resend-invite").set(authHeader()).expect(200);

    await request(app).patch("/api/v1/users/staff-db-id/deactivate").set(authHeader()).expect(200);

    await request(app).get("/api/v1/workers").set(authHeader()).expect(200);

    await request(app)
      .post("/api/v1/workers")
      .set(authHeader())
      .send({
        fullName: "Jane Worker",
        phone: "08000000000",
        location: "Lagos",
        nin: "12345678901",
        bvn: "12345678901",
        roles: [{ roleType: "nanny", yearsExperience: 3 }],
      })
      .expect(201);

    await request(app).get("/api/v1/workers/worker-1").set(authHeader()).expect(200);

    await request(app)
      .patch("/api/v1/workers/worker-1")
      .set(authHeader())
      .send({ notes: "Updated" })
      .expect(200);

    await request(app)
      .post("/api/v1/workers/worker-1/documents")
      .set(authHeader())
      .send({ documentType: "government_id", fileUrl: "https://example.com/doc.png" })
      .expect(201);

    await request(app)
      .post("/api/v1/workers/worker-1/references")
      .set(authHeader())
      .send({ fullName: "Ref Name", phone: "08020000000", relationship: "Former Employer" })
      .expect(201);

    await request(app)
      .post("/api/v1/workers/worker-1/guarantors")
      .set(authHeader())
      .send({ fullName: "Guarantor", phone: "08030000000", address: "Lagos Address", relationship: "Family" })
      .expect(201);

    await request(app).post("/api/v1/workers/worker-1/verification/submit").set(authHeader()).expect(200);
    await request(app).post("/api/v1/workers/worker-1/verification/approve").set(authHeader()).expect(200);
    await request(app)
      .post("/api/v1/workers/worker-1/verification/reject")
      .set(authHeader())
      .send({ reason: "Missing detail" })
      .expect(200);

    await request(app).get("/api/v1/employers").set(authHeader()).expect(200);

    await request(app)
      .post("/api/v1/employers")
      .set(authHeader())
      .send({ name: "Client One", type: "household", phone: "08010000000" })
      .expect(201);

    await request(app).get("/api/v1/employers/emp-1").set(authHeader()).expect(200);

    await request(app)
      .patch("/api/v1/employers/emp-1")
      .set(authHeader())
      .send({ notes: "VIP" })
      .expect(200);

    await request(app).get("/api/v1/job-requests").set(authHeader()).expect(200);

    await request(app)
      .post("/api/v1/job-requests")
      .set(authHeader())
      .send({
        employerId: "emp-1",
        roleType: "nanny",
        location: "Lagos",
        workArrangement: "live_in",
        employmentType: "full_time",
      })
      .expect(201);

    await request(app).get("/api/v1/job-requests/req-1").set(authHeader()).expect(200);

    await request(app)
      .patch("/api/v1/job-requests/req-1")
      .set(authHeader())
      .send({ notes: "Urgent" })
      .expect(200);

    mockPrisma.placement.findUnique.mockResolvedValueOnce({ id: "pl-1", jobRequestId: "req-1" });
    await request(app)
      .patch("/api/v1/job-requests/req-1/status")
      .set(authHeader())
      .send({ status: "placed" })
      .expect(200);

    await request(app).post("/api/v1/job-requests/req-1/matches").set(authHeader()).expect(200);
    await request(app).get("/api/v1/job-requests/req-1/matches").set(authHeader()).expect(200);

    await request(app).get("/api/v1/placements").set(authHeader()).expect(200);

    await request(app)
      .post("/api/v1/placements")
      .set(authHeader())
      .send({
        jobRequestId: "req-1",
        workerId: "worker-1",
        employerId: "emp-1",
        placementDate: new Date().toISOString(),
      })
      .expect(201);

    await request(app).get("/api/v1/placements/pl-1").set(authHeader()).expect(200);

    await request(app)
      .patch("/api/v1/placements/pl-1")
      .set(authHeader())
      .send({ status: "ended" })
      .expect(200);

    await request(app).get("/api/v1/dashboard/summary").set(authHeader()).expect(200);

    await request(app)
      .post("/api/v1/uploads/signature")
      .set(authHeader())
      .send({
        target: "worker_document",
        entityId: "worker-1",
        documentType: "government_id",
        fileName: "government-id.pdf",
      })
      .expect(200);

    await request(app)
      .post("/api/v1/uploads/verify")
      .set(authHeader())
      .send({ publicId: "worker_document_worker-1", version: 1, signature: "sig" })
      .expect(200);

    await request(app)
      .delete("/api/v1/uploads/asset")
      .set(authHeader())
      .send({ publicId: "worker_document_worker-1", resourceType: "image" })
      .expect(200);

    expect(mockSupabaseAdmin.auth.admin.inviteUserByEmail).toHaveBeenCalled();
    expect(mockSupabaseAdmin.auth.admin.updateUserById).toHaveBeenCalled();
    expect(mockCloudinary.utils.api_sign_request).toHaveBeenCalled();
    expect(mockPrisma.match.createMany).toHaveBeenCalled();
  });
});
