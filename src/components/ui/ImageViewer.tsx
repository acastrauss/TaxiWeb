import { useMemo, useRef } from "react";
import { FCC } from "../../utils/FCC";
import styles from './ImageViewer.module.css';
import { IconPlus } from "@tabler/icons-react";

interface IProps {
    imageUrl?: string;
    alt: string;

    setImageUrl: (url: any) => void;
}

export const ImageViewer: FCC<IProps> = (props) => {
    const imagePickerRef = useRef<null | HTMLInputElement>(null);

    function onImageUploaded(event: React.ChangeEvent<HTMLInputElement>) {
        if(!event.target.files){
            return;
        }
        const file = event.target.files[0];
        if(file){
            const reader = new FileReader();
            reader.onloadend = () => {
                props.setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const imageContent = useMemo(() => {
        if (props.imageUrl) {
            return <img className={styles.img} src={props.imageUrl} alt={props.alt} />
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

    }, [props.imageUrl, imagePickerRef]);


    return <div className={styles.root}>
        {imageContent}
    </div>
}