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
