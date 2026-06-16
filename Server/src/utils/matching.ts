import type { JobRequest, Match, Worker, WorkerRole, WorkerVerificationStatus } from "@prisma/client";

type WorkerWithRoles = Worker & {
  roles: WorkerRole[];
};

const acceptableVerificationStatuses: WorkerVerificationStatus[] = ["verified"];

export const scoreWorkerForRequest = (jobRequest: JobRequest, worker: WorkerWithRoles) => {
  let score = 0;
  const reasons: string[] = [];

  const hasRoleMatch = worker.roles.some((role) => role.roleType === jobRequest.roleType);
  if (!hasRoleMatch) {
    return { score: 0, reasons: ["role_mismatch"], eligible: false };
  }

  score += 40;
  reasons.push("role_match");

  if (acceptableVerificationStatuses.includes(worker.verificationStatus)) {
    score += 20;
    reasons.push("verified");
  } else {
    reasons.push("verification_incomplete");
  }

  if (worker.availabilityStatus === "available") {
    score += 20;
    reasons.push("available");
  } else {
    reasons.push("not_available");
    return { score, reasons, eligible: false };
  }

  if (worker.location.trim().toLowerCase() === jobRequest.location.trim().toLowerCase()) {
    score += 10;
    reasons.push("same_location");
  }

  if ((worker.experienceYears ?? 0) >= 2) {
    score += 10;
    reasons.push("experience_match");
  }

  const eligible = acceptableVerificationStatuses.includes(worker.verificationStatus);

  return { score, reasons, eligible };
};

export const sortMatchesDescending = <T extends Match | { score: number }>(matches: T[]) =>
  [...matches].sort((a, b) => b.score - a.score);
