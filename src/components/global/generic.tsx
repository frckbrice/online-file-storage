import * as React from 'react';

export interface IGenericProps<T> {
    data: T;
    render: (data: T) => React.ReactNode;
}

export function Generic<T>({ data, render }: IGenericProps<T>) {
    return (
        <div>
            {render(data)}
        </div>
    );
}
