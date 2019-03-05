    import * as React from "react";

    const ConditionalSwitch = <C extends React.ComponentType<any>>({ Component,  showIfTrue, ...rest}: { Component: C, showIfTrue: boolean} & React.ComponentProps<C> ) => (
        showIfTrue
            ? <Component {...(rest as any) }/>
            : null
    );

    function TestComp({ title, text}: {title: string, text: string}) {
        return null!;
    }

    let e = <ConditionalSwitch Component={TestComp} showIfTrue={true} title="aa" text="aa" />  // title and text are checked
