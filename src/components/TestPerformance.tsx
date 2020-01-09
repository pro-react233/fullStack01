import * as React from "react";

export class Counter extends React.Component<
    { children?: React.ReactChild | React.ReactChild[] },
    { currentValue: number }
> {
    state = {
        currentValue: 0
    };

    render() {
        console.log("Counter render");
        return (
            <div>
                <div>{`Current value:${this.state.currentValue}`}</div>
                <div>
                    <button onClick={this.up}>Up</button>
                    <button onClick={this.down}>Down</button>
                </div>
                <div>
                    <h4>Nested</h4>
                    {this.props.children}
                </div>
            </div>
        );
    }

    // shouldComponentUpdate(props: any, state: any) {
    //     return this.state.currentValue !== state.currentValue;
    // }

    private up = () =>
        this.setState({ currentValue: this.state.currentValue + 1 });
    private down = () =>
        this.setState({ currentValue: this.state.currentValue - 1 });
}

export class TestPerformance extends React.Component<
    {
        children: React.ReactChild | React.ReactChild[];
    },
    { mutable: boolean }
> {
    state = { mutable: true };

    render() {
        console.log("TestPerformance render");
        return (
            <div>
                <h5>Some immutable content</h5>
                <label>
                    Mutable:{" "}
                    <input
                        type="checkbox"
                        checked={this.state.mutable}
                        onChange={e => {
                            this.setState({ mutable: e.target.checked });
                            //this.forceUpdate();
                        }}
                    />
                </label>
                <Counter />
                <h5>Children:</h5>
                <div>{this.props.children}</div>
            </div>
        );
    }

    shouldComponentUpdate(nextProps: {
        children: React.ReactChild | React.ReactChild[];
    }) {
        if (nextProps.children !== this.props.children) {
            console.log("Children objects are different");
        } else {
            console.log("Children objects are the same");
        }

        const prev = React.Children.toArray(this.props.children);
        const next = React.Children.toArray(nextProps.children);

        for (let i = 0; i < prev.length; i++) {
            console.log(
                `Children at ${i} are ${
                    prev[i] === next[i] ? "the same" : "different"
                }`
            );
        }

        // return this.state.mutable !== nextState.mutable;

        return false;
    }
}
