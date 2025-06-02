import { useState, useEffect } from "react";
import { Typography, Tabs, Box, Tab } from "@mui/material";
import { Run } from "../../execution/domain/model";
import { useSurveillanceLocales } from "../../../../locales/ca/locales.ts";
import { RunDetailsCard } from "./runDetailsCard";
import { RunInspectionsList } from "./runInspectionsList";
import { RunVideoSection } from "./runVideoSection";
import { InspectionFormReadOnly } from "./readOnlyForm.tsx";
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`video-tab-${index}`}
            aria-labelledby={`video-tab-${index}`}
            {...other}
            className="h-full"
        >
            {value === index && (
                <Box sx={{ height: '100%' }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `video-tab-${index}`,
        'aria-controls': `video-tabpanel-${index}`,
    };
}


export const RunReport = ({ run }: { run: Run }) => {
    const runDetailsTitle = useSurveillanceLocales("run.details.title");
    const runInspectionsTitle = useSurveillanceLocales("run.details.inspections");
    const videoTitle = useSurveillanceLocales("run.report.videoTitle");
    const videoNotSupported = useSurveillanceLocales("run.report.videoNotSupported");
    const cameraLabel = useSurveillanceLocales("run.report.cameraLabel");
    const durationLabel = useSurveillanceLocales("run.report.durationLabel");
    const dateLabel = useSurveillanceLocales("run.report.dateLabel");
    const notAvailable = useSurveillanceLocales("run.report.notAvailable");
    const normalStatus = useSurveillanceLocales("run.anomalyStatuses.normal");
    const singleAnomalyStatus = useSurveillanceLocales("run.anomalyStatuses.singleAnomaly");
    const multipleAnomaliesStatus = useSurveillanceLocales("run.anomalyStatuses.multipleAnomalies");

    const [selectedInspection, setSelectedInspection] = useState(run.inspectionRuns?.[0]);

    const [value, setValue] = useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        console.log(run)
    }
        , [run]);
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-2 bg-tableBg py-3 px-6 rounded-[10px] w-full flex-shrink-0">
                <Typography className="uppercase !text-primary !font-semibold">{run.roundId || "N/A"}</Typography>
                <Typography className="uppercase">{run.rootLocationId || "N/A"}</Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow mt-4 overflow-hidden">
                <div className="flex flex-col bg-tableBg p-6 rounded-[10px]">
                    <h1 className="text-xl font-bold mb-4">{runDetailsTitle}</h1>
                    <span className="bg-[#313131] block p-[1px] w-full mb-5"></span>

                    <RunDetailsCard run={run} />

                    <RunInspectionsList
                        inspections={run.inspectionRuns || []}
                        selectedInspectionId={selectedInspection?.id}
                        onSelectInspection={setSelectedInspection}
                        singleAnomalyStatus={singleAnomalyStatus}
                        multipleAnomaliesStatus={multipleAnomaliesStatus}
                        normalStatus={normalStatus}
                        runInspectionsTitle={runInspectionsTitle}
                    />
                </div>

                <div className="flex flex-col bg-tableBg rounded-[10px] overflow-hidden h-full">
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}>
                        <Tabs value={value} onChange={handleChange} aria-label="video tabs">
                            <Tab label="Camara" {...a11yProps(0)} />
                            <Tab label="Respuestas" {...a11yProps(1)} />
                        </Tabs>
                    </Box>

                    <div className="flex-grow overflow-auto">
                        <TabPanel value={value} index={0}>
                            <RunVideoSection
                                videoTitle={`${videoTitle} - Camera 1`}
                                selectedInspection={selectedInspection}
                                videoNotSupported={videoNotSupported}
                                cameraLabel={cameraLabel}
                                durationLabel={durationLabel}
                                dateLabel={dateLabel}
                                notAvailable={notAvailable}
                            />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <InspectionFormReadOnly inspection={selectedInspection} />
                        </TabPanel>
                    </div>
                </div>
            </div>
        </div>
    );
};