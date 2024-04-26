import { h, Fragment, ComponentChildren } from "preact";
import { CogIcon } from "@heroicons/react/24/solid";

export interface LoadingProps {
    loading: boolean;
    text?: string;
    children: ComponentChildren;
}

export default function Loading(props: LoadingProps) {
    return (
        <>
            {props.loading
                ? <div class="w-full h-full flex flex-col justify-center items-center text-grey-500">
                    <CogIcon class="w-12 h-12 text-inherit animate-spin" />
                    <p>{props.text}</p>
                </div>
                : props.children
            }
        </>
        
    );
}