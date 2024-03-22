interface MnemonicProps {
    readonly index: number;
    readonly words: string[];
}

const Word = function({ index, words }: MnemonicProps) {
    return <span>{`${`${index + 1}`.padStart(2, "0")}: ${words[index]}`}</span>;
};

export const WordLine = function(props: MnemonicProps) {
    const props1 = { ...props, index: props.index + 1 };
    const props2 = { ...props, index: props.index + 2 };
    const props3 = { ...props, index: props.index + 3 };
    return <div className="grid"><Word {...props} /><Word {...props1} /><Word {...props2} /><Word {...props3} /></div>;
};
