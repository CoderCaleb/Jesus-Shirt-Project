export type TextComponentProps = {
  text: string;
  additionalStyles?: string;
};

const SubText: React.FC<TextComponentProps> = ({ text, additionalStyles }) => {
  return <p className={`text-md text-slate-600 ${additionalStyles}`}>{text}</p>;
};
export default SubText;
