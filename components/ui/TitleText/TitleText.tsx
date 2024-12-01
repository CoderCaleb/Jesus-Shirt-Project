export type TextComponentProps = {
  text: string;
  additionalStyles?: string;
};
const TitleText: React.FC<TextComponentProps> = ({
  text,
  additionalStyles,
}) => {
  return (
    <p
      className={`${additionalStyles} font-bold text-3xl text-black text-center`}
    >
      {text}
    </p>
  );
};
export default TitleText;
