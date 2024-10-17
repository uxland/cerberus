export const maintenanceCameraSettingsMock = [
  {
    description: "maintenance-no-blur-detection",
    args: {
      threshold: 0.5,
      blurSize: 3,
      blurSigma: 3,
    },
  },
  {
    description: "maintenance-no-blobs-detection",
    args: {
      threshold: 0.5,
      kernelSize: 3,
    },
  },
];

export const maintenanceCameraSettingsMap = {
  "maintenance-blurry-detection-script": {
    description: "Blurry image detection",
    args: {
      threshold: 100,
    },
  },
  "maintenance-no-blobs-detection-script": {
    description: "No blobs detection",
    args: {
      arg2: 255,
      threshold: 128,
    },
  },
};
