import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  ContainerSASPermissions,
  generateBlobSASQueryParameters,
  SASProtocol,
} from "@azure/storage-blob";

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || "devstoreaccount1";
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw=="; // Default devstore key

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

export async function generateUploadSas(containerName: string, blobName: string) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  
  // Ensure container exists
  if (!process.env.AZURE_STORAGE_ACCOUNT_NAME) {
     // If we are in mock mode (no env vars), we can skip actual container creation check for now or Mock it
     console.log("Mock Mode: Skipping container creation check");
  } else {
     await containerClient.createIfNotExists();
  }

  const startDate = new Date();
  const expiryDate = new Date(startDate);
  expiryDate.setMinutes(startDate.getMinutes() + 60); // 1 hour expiration

  const permissions = ContainerSASPermissions.parse("racwd"); // read, add, create, write, delete

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions,
      startsOn: startDate,
      expiresOn: expiryDate,
      protocol: SASProtocol.HttpsAndHttp,
    },
    sharedKeyCredential
  ).toString();

  return {
    sasToken,
    url: `${containerClient.url}/${blobName}?${sasToken}`
  };
}
