"use client";
import { useEffect, useState } from "react";
import getAllFilters from "@/utils/getAllFilters";
import { Filter } from "@/types";
import { filterByModality } from "@/utils/filterPropuestas";

export default function FiltrosPropuestas({ propuestas, onSendData }) {
  const [filters, setFilters] = useState<Filter>();
  const [deployMenu, setDeployMenu] = useState<string | false>();
  const [filterDetails, setFilterDetails] = useState<Array<string | null>>();

  function handleFiltro(filtro: "modality" | "skills" | "type" | "level" | "profession" | "payment") {
    if (filtro === "payment") {
      setDeployMenu(filtro);
      setFilterDetails(filters?.payment);
    } else {
      setDeployMenu(filtro);
      setFilterDetails(filters?.[filtro]);
    }
  }

  function resetFilters() {
    setDeployMenu(false)
    setFilterDetails([])
    onSendData(propuestas);
  }

  function handleFilterData(filter: string, value: string) {
    console.log(filter, value);

    if (propuestas.length > 0) {
      const result = filterByModality(filter, value, propuestas);
      if (typeof result === "object" && result.length > 0) {
        onSendData(result);
      } else return [];
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
    <div className="flex flex-col items-center justify-center bg-black py-5 px-20 rounded">
      <div className="flex flex-row gap-5">
        <button className="filterbutton" onClick={() => (deployMenu == "modality" ? setDeployMenu(false) : handleFiltro("modality"))}>
          Modalidad
        </button>
        <button className="filterbutton" onClick={() => (deployMenu == "skills" ? setDeployMenu(false) : handleFiltro("skills"))}>
          Skills
        </button>
        <button className="filterbutton" onClick={() => (deployMenu == "profession" ? setDeployMenu(false) : handleFiltro("profession"))}>
          Profesion
        </button>
        <button className="filterbutton" onClick={() => (deployMenu == "level" ? setDeployMenu(false) : handleFiltro("level"))}>
          Nivel
        </button>
        <button className="filterbutton" onClick={() => (deployMenu == "type" ? setDeployMenu(false) : handleFiltro("type"))}>
          Tipo de propuesta
        </button>
        <button className="filterbutton" onClick={() => (deployMenu == "payment" ? setDeployMenu(false) : handleFiltro("payment"))}>
          Tipo de pago
        </button>
        <button className="filterbutton" onClick={() => resetFilters()}>
          Mostrar todos
        </button>
      </div>

      {deployMenu == "payment" || deployMenu == "modality" || deployMenu == "level" || (deployMenu == "type" && typeof filterDetails === "object") ? (
        <div className="mt-5 w-full flex flex-row items-center justify-center gap-3">
          {filterDetails?.map((filter) => (
            <button key={filter} className="filterbutton first-letter:uppercase " onClick={() => handleFilterData(deployMenu, filter as string)}>
              {filter}
            </button>
          ))}
        </div>
      ) : deployMenu ? (
        <div>
          <input type="text" placeholder={`Ingrese la ${deployMenu}`} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
