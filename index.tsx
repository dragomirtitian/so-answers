import * as React from "react";
import { FunctionComponent } from "react";

type InputProps = { // The common Part
    className?: string;
    placeholder?: string;
} & ({ // The discriminated union
    type?: "text";
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} | {
    type: "textarea";
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
})

const Input: FunctionComponent<InputProps> = (props: InputProps) => {
    if (props.type === 'textarea') {
        return <textarea {...props} />;
    }
    return <input {...props} />;
};


type State = {}
class Usage extends React.Component<State> {
    state!: State;

    onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ input: e.target.value });
    };

    render() {
        return (
            <Input placeholder="Write an something..." onChange={this.onInputChange} />
        );
    }
}