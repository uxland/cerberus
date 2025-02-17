import { useUpdateModal } from "@cerberus/core/src/providers";
import { Button } from "@mui/material";
import { DeleteCamera } from "./command";
import { Mediator } from "mediatr-ts";
import { Fullscreen } from "@mui/icons-material";
import { InputField } from "@cerberus/core";
export const RemoveCameraModal = (id: string, description: string) => {
    const updateModal = useUpdateModal();

    const handleSubmit = async () => {
        const mediator = new Mediator();
        await mediator.send(new DeleteCamera(id, description));
        updateModal(null);
    };

    const openModal = () => {
        updateModal({
            title: "Estàs segur que vols eliminar aquesta càmera?",
            fullScreen: true,
            maxWidth: 'md', 
            className: "",
            content: () => (
                <div className="flex flex-row gap-4 m-12"> 
                    <h1>Creación de Operativa</h1>
                    <InputField
                        title={"Operativa"}
                        onChange={""}
                    />                
                    </div>
            ),
        });
    };

    return openModal;
};

// export const RemoveCameraModal = (id: string, description: string) => {
    //     const updateModal = useUpdateModal();
    
    //     const handleSubmit = async () => {
    //         const mediator = new Mediator();
    //         await mediator.send(new DeleteCamera(id, description));
    //         updateModal(null);
    //     };
    
    //     const openModal = () => {
    //         updateModal({
    //             title: "Estàs segur que vols eliminar aquesta càmera?",
    //             maxWidth: "lg",
    //             closeAction: true,
    //             className: "",
    //             content: () => (
    //                 <div className="flex flex-col justify-center items-center gap-4">
    //                     <h1>Camerà {description}</h1>
    //                     <div className="flex gap-4">
    //                         <Button onClick={handleSubmit}>Si</Button>
    //                         <Button onClick={() => updateModal(null)}>No</Button>
    //                     </div>
    //                 </div>
    //             ),
    //         });
    //     };
    
    //     return openModal;
    // };