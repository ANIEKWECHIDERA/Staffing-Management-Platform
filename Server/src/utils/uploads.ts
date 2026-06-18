type UploadTarget =
  | "worker_profile"
  | "worker_document"
  | "employer_attachment"
  | "staff_credential"
  | "generic";

type BuildUploadParamsInput = {
  target: UploadTarget;
  entityId?: string;
  fileName: string;
  documentType?: string;
  resourceType: "image" | "raw" | "auto";
  actorId: string;
};

const sanitizeSegment = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const getFileExtension = (fileName: string) => {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.at(-1)?.toLowerCase() ?? "" : "";
};

const resolveAllowedFormats = (target: UploadTarget) => {
  if (target === "worker_profile") {
    return ["png", "jpg", "jpeg"];
  }

  return ["pdf", "doc", "docx", "xls", "xlsx", "csv", "png", "jpg", "jpeg"];
};

const resolveResourceType = (target: UploadTarget, requestedResourceType: "image" | "raw" | "auto", fileName: string) => {
  const ext = getFileExtension(fileName);
  const imageFormats = ["png", "jpg", "jpeg"];

  if (target === "worker_profile") {
    return "image";
  }

  if (requestedResourceType !== "auto") {
    return requestedResourceType;
  }

  return imageFormats.includes(ext) ? "image" : "raw";
};

const buildFolder = (target: UploadTarget, entityId?: string) => {
  const base = "Skillbridge OS";

  switch (target) {
    case "worker_profile":
      return entityId ? `${base}/workers/${entityId}/profile` : `${base}/workers/profile`;
    case "worker_document":
      return entityId ? `${base}/workers/${entityId}/documents` : `${base}/workers/documents`;
    case "employer_attachment":
      return entityId ? `${base}/employers/${entityId}/attachments` : `${base}/employers/attachments`;
    case "staff_credential":
      return entityId ? `${base}/staff/${entityId}/credentials` : `${base}/staff/credentials`;
    default:
      return `${base}/misc`;
  }
};

export const buildSignedUploadParams = (input: BuildUploadParamsInput) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = buildFolder(input.target, input.entityId);
  const allowedFormats = resolveAllowedFormats(input.target);
  const parts = [
    sanitizeSegment(input.target),
    input.entityId ? sanitizeSegment(input.entityId) : undefined,
    input.documentType ? sanitizeSegment(input.documentType) : undefined,
    sanitizeSegment(input.fileName.replace(/\.[^.]+$/, "")),
    Date.now().toString(),
  ].filter(Boolean);

  const publicId = parts.join("_");
  const tags = [
    "skillbridge",
    `target:${input.target}`,
    input.entityId ? `entity:${input.entityId}` : undefined,
    input.documentType ? `document:${input.documentType}` : undefined,
  ].filter(Boolean);

  const context = {
    uploaded_by: input.actorId,
    target: input.target,
    entity_id: input.entityId ?? "",
    document_type: input.documentType ?? "",
  };

  return {
    timestamp,
    folder,
    public_id: publicId,
    tags: tags.join(","),
    context,
    resource_type: resolveResourceType(input.target, input.resourceType, input.fileName),
    allowed_formats: allowedFormats,
  };
};
