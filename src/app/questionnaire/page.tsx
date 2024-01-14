import { FORM_DATA } from "./content";
import { MultiStepForm } from "./_components/multiStepForm";
import { Provider } from "jotai";

export default function Page() {

  return (
    <div className="flex flex-col grow">
      <Provider>
        <MultiStepForm
          stepsData={FORM_DATA}
          className="self-center w-full flex flex-col gap-8 items-center min-h-[calc(100svh-10rem)]"
        />
      </Provider>
    </div>
  );
}
