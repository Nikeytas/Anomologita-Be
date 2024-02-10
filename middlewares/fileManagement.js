const multer = require("multer");
const { createBlobServiceClient } = require("../services/azure/azure");
// const {
//   blobServiceClient,
//   containerClient,
// } = require("../services/azure/azure"); // Import the Azure Blob Service Client from azure.js

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "application/pdf": "pdf",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "pptx",
};

const storage = multer.memoryStorage();
const fileUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type");
    cb(error, isValid);
  },
}).single("file"); // Handle a single file upload

// Middleware to upload a file to Azure Blob Storage
const uploadFileToAzure = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let fileName = req.file.originalname.replace(
      new RegExp(`.${MIME_TYPE_MAP[req.file.mimetype]}`, "g"),
      ""
    );

    // let blobName = uuid() + `_${fileName}.` + MIME_TYPE_MAP[req.file.mimetype];
    let blobName = `${req.body.whichFile}.` + MIME_TYPE_MAP[req.file.mimetype];
    const stream = req.file.buffer;

    blobName = `FY-${req.body.fyId}/FW-${req.body.kpiFrameworkId}/` + blobName;

    // Get a reference to the container
    // const containerClient = blobServiceClient.getContainerClient(containerName);
    const { containerClient } = await createBlobServiceClient();

    // // alt
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadBlobResponse = await blockBlobClient.upload(
      stream,
      stream.length,
      {
        blobHTTPHeaders: {
          blobContentType: req.file.mimetype,
        },
      }
    );
    console.log(
      `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
    );

    // File uploaded successfully
    req.azureBlobUrl = blockBlobClient.url;
    next();
  } catch (error) {
    // Handle upload error
    console.error("Error uploading file to Azure Blob Storage:", error);
    res
      .status(500)
      .json({ message: "Error uploading file to Azure Blob Storage", error });
  }
};

// Function to delete a blob
const deleteBlobFromAzure = async (blobName) => {
  // const containerClient = blobServiceClient.getContainerClient(containerName);
  const { containerClient } = await createBlobServiceClient();
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    await blockBlobClient.delete();
    console.log(`Blob ${blobName} deleted successfully.`);
  } catch (error) {
    // Check if the error is "BlobNotFound"
    if (error.details && error.details.errorCode === "BlobNotFound") {
      // Handle the "BlobNotFound" error case here (if needed)
      console.log(`Blob ${blobName} not found.`);
    } else {
      // Handle other errors
      console.error(`Error deleting blob ${blobName}:`, error);
      throw error;
    }
  }
};

// Function to download a blob
const downloadBlobFromAzure = async (blobName) => {
  // const containerClient = blobServiceClient.getContainerClient(containerName);
  const { containerClient } = await createBlobServiceClient();
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    const response = await blockBlobClient.download(0);
    const blobData = await streamToBuffer(response.readableStreamBody);
    return blobData; // Return the blob data as a buffer
  } catch (error) {
    console.error(`Error downloading blob ${blobName}:`, error);
    throw error;
  }
};

function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
}

module.exports = {
  fileUpload,
  uploadFileToAzure,
  deleteBlobFromAzure,
  downloadBlobFromAzure,
  MIME_TYPE_MAP,
};
