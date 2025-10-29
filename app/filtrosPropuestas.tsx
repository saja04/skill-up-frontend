"use client";
import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
import getAllFilters from "@/utils/getAllFilters";
import { Course, Filter } from "@/types";
import { filterByModality } from "@/utils/filterPropuestas";

export default function FiltrosPropuestas({ propuestas, onSendData }: { propuestas: Array<Course | undefined>; onSendData: (courses: Array<Course | undefined>) => void }) {
  const [filters, setFilters] = useState<Filter>();
  const [deployMenu, setDeployMenu] = useState<string | false>();
  const [filterDetails, setFilterDetails] = useState<Array<string | null>>();
  const [activeFilter, setActiveFilter] = useState<{
    type: "modality" | "skills" | "type" | "level" | "profession" | "payment" | "";
    value: string;
  }>({
    type: "",
    value: "",
  });

  function handleFiltro(filtro: "modality" | "skills" | "type" | "level" | "profession" | "payment") {
    if (filtro === "payment") {
      setDeployMenu(filtro);
      setFilterDetails(filters?.payment);
    } else {
      setDeployMenu(filtro);
      console.log(filters?.[filtro]);

      setFilterDetails(filters?.[filtro]);
    }
  }

  function resetFilters() {
    window.location.reload();
  }

  function handleFilterData(filterType: "modality" | "skills" | "type" | "level" | "profession" | "payment" | "", value: string) {
    setActiveFilter({ type: filterType, value });

    if (propuestas.length > 0 && filterType != "") {
      const result = filterByModality(filterType, value, propuestas);
      onSendData(result.length > 0 ? result : []);
    }
  }

  useEffect(() => {
    async function main() {
      const filterss: Filter = getAllFilters();

      setFilters(filterss);
    }
    main();
  }, []);

  useEffect(() => {}, [deployMenu]);

  return (
    <div className="w-11/12 flex flex-col items-center justify-center bg-black py-5 px-4 lg:px-20 md:px-20 rounded">
      <p className="text-2xl">Filtros</p>
      <div className="flex flex-wrap justify-center lg:flex-row gap-5 mt-4">
        <div className="flex flex-row items-center gap-2">
          <p className="text-lg">Modalidad:</p>
          <select value={activeFilter.type === "modality" ? activeFilter.value : ""} className="modality" onChange={(e) => handleFilterData("modality", e.target.value as string)}>
            <option value="" disabled>
              Todo
            </option>
            {filters?.modality.map((modality) => (
              <option className="first-letter:uppercase" key={modality} value={modality ? modality : ""}>
                {modality}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-row items-center gap-2">
          <p className="text-lg">Nivel:</p>
          <select value={activeFilter.type === "level" ? activeFilter.value : ""} className="modality" onChange={(e) => handleFilterData("level", e.target.value as string)}>
            <option value="" disabled>
              Todo
            </option>
            {filters?.level.map((level) => (
              <option className="first-letter:uppercase" key={level} value={level ? level : ""}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-row items-center gap-2">
          <p className="text-lg">Tipo:</p>
          <select value={activeFilter.type === "type" ? activeFilter.value : ""} className="modality" onChange={(e) => handleFilterData("type", e.target.value as string)}>
            <option value="" disabled>
              Todo
            </option>
            {filters?.type.map((type) => (
              <option className="first-letter:uppercase" key={type} value={type ? type : ""}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-row items-center gap-2">
          <p className="text-lg">Pago:</p>
          <select value={activeFilter.type === "payment" ? activeFilter.value : ""} className="modality" onChange={(e) => handleFilterData("payment", e.target.value as string)}>
            <option value="" disabled>
              Todo
            </option>
            {filters?.payment.map((payment) => (
              <option className="first-letter:uppercase" key={payment} value={payment ? payment : ""}>
                {payment}
              </option>
            ))}
          </select>
        </div>
        <div className=" flex flex-row gap-5">
          <button className="filterbutton" onClick={() => (deployMenu == "skills" ? setDeployMenu(false) : handleFiltro("skills"))}>
            Skills
          </button>
          <button className="filterbutton" onClick={() => (deployMenu == "profession" ? setDeployMenu(false) : handleFiltro("profession"))}>
            Profesion
          </button>
          <button className="filterbutton" onClick={() => resetFilters()}>
            Mostrar todos
          </button>
        </div>
      </div>

      {deployMenu == "payment" || deployMenu == "modality" || deployMenu == "level" || (deployMenu == "type" && typeof filterDetails === "object") ? (
        <div className="mt-5 w-full flex flex-row items-center justify-center gap-3">
          {filterDetails?.map((filter) => {
            console.log(filter);
            return (
              <div key={filter}>
                <button className="filterbutton first-letter:uppercase " onClick={() => handleFilterData(deployMenu, filter as string)}>
                  {filter}
                </button>
              </div>
            );
          })}
        </div>
      ) : deployMenu ? (
        <div>
          <input type="text" className="rounded w-60 bg-zinc-900 mt-5 text-lg px-4 py-1" placeholder={`Ingrese la ${deployMenu}`} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
