import { Fragment, useMemo, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon } from "lucide-react";
import { getCityNameAutoComplete } from "@/hooks";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { shippingFormSchema } from "@/components/customer-form";
import { CityData, CountryData, CountryState } from "@/types";
import { useAddressConfirmation } from "@/hooks/useAddressConfirmation";
import { cn } from "@/lib/utils";

interface ICityProps {
  countryData: CountryData[];
  form: UseFormReturn<z.infer<typeof shippingFormSchema>>;
  countryState: CountryState[];
}

export default function CityAutoComplete({
  countryData,
  form,
  countryState,
}: ICityProps) {
  const [cityData, setCityData] = useState<CityData[]>([]);
  const [selected, setSelected] = useState(cityData[0]);
  const [query, setQuery] = useState("");
  const isConfirmed = useAddressConfirmation((state) => state.isConfirmed);
  const isInvalid = useAddressConfirmation((state) => state.isInvalid);

  const filteredCityData = useMemo(() => {
    return query === ""
      ? cityData
      : cityData.filter((postCode) =>
          postCode.cityName.toLowerCase().includes(query.toLowerCase())
        );
  }, [cityData, query]);

  const formValue = form.getValues("city");

  return (
    <Combobox
      value={selected || formValue}
      onChange={(value) => {
        setSelected(value);
        const state = countryState.find(
          (s) => s.shortCode === value.subdivisionCode
        );
        if (state) form.setValue("state", state.id);
        form.setValue("postCode", value.postCode);
        form.setValue("city", value.cityName);
      }}
    >
      <div className="relative mt-1">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className={cn(
              "flex h-[50px] w-full rounded-md border border-input bg-background px-3 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              isConfirmed
                ? "border border-border_confirmed bg-input_confirmed"
                : isInvalid
                ? "border border-red-400"
                : ""
            )}
            displayValue={() => formValue}
            onChange={(event) => {
              form.setValue("city", event.target.value);
              setQuery(event.target.value);
              getCityNameAutoComplete({
                cityName: event.target.value,
                country: countryData[0].countryCode,
                language: countryData[0].language,
              }).then((res) => {
                if (res.predictions) setCityData(res.predictions);
              });
            }}
            placeholder={"Enter your city ..."}
          />
        </div>
      </div>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        afterLeave={() => setQuery("")}
      >
        <Combobox.Options className="absolute mt-1 max-h-60 w-full px-2 max-w-fit overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredCityData.length === 0 && query !== "" ? (
            <div className="relative cursor-default select-none py-2  text-gray-700 px-2">
              Nothing found.
            </div>
          ) : (
            filteredCityData.map((city, key) => (
              <Combobox.Option
                key={key}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 px-2 ${
                    active ? " bg-darkGreen " : "text-gray-900"
                  } ${key === 0 ? "bg-darkGreen" : ""}`
                }
                value={city}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium bg-green-50" : "font-normal"
                      }`}
                    >
                      <span>{city.postCode} ,</span>
                      <span>
                        <span className="border-b text-suggestion font-semibold border-dashed border-border_confirmed">
                          {city.cityName.substring(0, formValue.length)}
                        </span>
                        {city.cityName.substring(formValue.length)}
                      </span>
                      <span className="text-neutral-400">
                        ,{" "}
                        {
                          countryState.find(
                            (state) => state.shortCode === city.subdivisionCode
                          )?.name
                        }
                      </span>
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? "text-white" : "text-border_confirmed"
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Transition>
    </Combobox>
  );
}
