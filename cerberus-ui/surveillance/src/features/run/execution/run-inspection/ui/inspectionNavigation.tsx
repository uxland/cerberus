import { InspectionRun } from '../../domain/model.ts';

interface InspectionNavigationProps {
    inspectionRuns: InspectionRun[];
    currentInspectionId: string;
}

export const InspectionNavigation = ({ inspectionRuns, currentInspectionId }: InspectionNavigationProps) => {
    return (
        <div className="flex flex-wrap gap-2 mt-4 px-2 flex-shrink-0">
            {inspectionRuns.map((inspection, index) => (
                <span
                    key={inspection.inspectionId}
                    className={`h-[50px] w-[50px] rounded-[10px] flex items-center justify-center text-grey82 cursor-pointer ${currentInspectionId === inspection.inspectionId ? 'bg-[#313131]' : 'bg-tableBg'
                        }`}
                >
                    {index + 1}
                </span>
            ))}
            <span className="h-[50px] w-[50px] bg-tableBg rounded-[10px] flex items-center justify-center text-grey82">
                + 35
            </span>
        </div>
    );
};