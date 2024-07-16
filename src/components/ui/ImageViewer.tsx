import { useMemo, useRef, useState } from "react";
import { FCC } from "../../utils/FCC";
import styles from './ImageViewer.module.css';
import { IconPlus } from "@tabler/icons-react";

interface IProps {
    imageUrl?: string;
    alt: string;

    setImageUrl: (url: any) => void;
    setLocalName: (name: string) => void;
}

export const ImageViewer: FCC<IProps> = (props) => {
    const imagePickerRef = useRef<null | HTMLInputElement>(null);
    const [localImageUrl, setLocalImageUrl] = useState<any>(undefined);

    function onImageUploaded(event: React.ChangeEvent<HTMLInputElement>) {
        if(!event.target.files){
            return;
        }
        const file = event.target.files[0];
        if(file){
            const reader = new FileReader();
            reader.onloadend = () => {
                setLocalImageUrl(reader.result);
                props.setImageUrl(file);
                props.setLocalName(file.name);
            };
            reader.readAsDataURL(file);
        }
    }

    const imageContent = useMemo(() => {
        if (props.imageUrl) {
            return <img className={styles.img} src={localImageUrl} alt={props.alt} />
        }

        return <>
            <input style={{ display: 'none' }} type="file" multiple={false} accept='image/jpeg, image/png' ref={imagePickerRef} onChange={onImageUploaded}/>
            <div className={styles.uploadIcon}>
                <IconPlus size={44} onClick={(ev) => {
                    ev.preventDefault();
                    if(imagePickerRef.current){
                        imagePickerRef.current.click();
                    }
                }}/>
            </div>
        </>

    }, [localImageUrl, imagePickerRef]);


    return <div className={styles.root}>
        {imageContent}
    </div>
}