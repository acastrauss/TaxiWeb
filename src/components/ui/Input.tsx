import React, { FC, HTMLInputTypeAttribute, useMemo } from "react";
import styles from "./Input.module.css";

interface IProps {
  textValue: string;
  onChangeText: (val: string) => void;
  type: HTMLInputTypeAttribute;
  placeholder: string;
  isValid: boolean;
}

export const Input: FC<IProps> = (props) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChangeText(e.target.value);
  };

  const isLabelVisible = useMemo(() => {
    return props.textValue.length === 0;
  }, [props.textValue]);

  const isDate = props.type === "date" ? styles.date__padding : "";
  return (
    <>
      <div className={styles.input__container}>
        <input
          type={props.type}
          onChange={handleInputChange}
          value={props.textValue}
          className={
            props.isValid
              ? `${styles.animated__input} ${styles.invalid} ${isDate}`
              : `${styles.animated__input} ${styles.invalid} ${isDate}`
          }
        />
        <label
          className={`${styles.animated__label} ${
            !isLabelVisible ? styles.hidden : ""
          }`}
        >
          {props.placeholder}
        </label>
      </div>
    </>
  );
};