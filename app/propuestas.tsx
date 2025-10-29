"use client";
import Link from "next/link";
import courses from "../courses.json";
import FiltrosPropuestas from "./filtrosPropuestas";
import { useEffect, useState } from "react";
import { filterByModality, filterByRecommended } from "@/utils/filterPropuestas";
import { Course, User } from "@/types";

export default function Propuestas() {
  const [database, setDataBase] = useState<Array<Course | undefined>>([]);
  const [coursesDisplay, setCoursesDisplay] = useState<Array<Course | undefined>>([]);
  const [user, setUser] = useState<User>();

  function handleFilterData(data: Array<Course | undefined>) {
    if (data.length > 0) {
      setCoursesDisplay(data);
    }
  }

  useEffect(() => {
    async function main() {
      const data = localStorage.getItem("db");
      const rawUser = localStorage.getItem("user");
      let gotUser: boolean = false;
      if (rawUser && rawUser.length > 0) {
        setUser(JSON.parse(rawUser));
        gotUser = true;
      }
      if (data && data.length > 10) {
        setDataBase(JSON.parse(data));
        if (gotUser && rawUser && rawUser.length > 0) {
          console.log("se reasignaron los cursos mostrando los recomendados primero");
          console.log(courses[0]);
          
          setCoursesDisplay(filterByRecommended(JSON.parse(rawUser), JSON.parse(data)));
        } else {
          setCoursesDisplay(JSON.parse(data));
        }
      } else {
        console.log("db del local storage vacia, se agrego al localStorage");
        localStorage.setItem("db", JSON.stringify(courses));
        setDataBase(courses);
        if (gotUser && rawUser && rawUser.length > 0) {
          setCoursesDisplay(filterByRecommended(JSON.parse(rawUser), courses));
        } else {
          setCoursesDisplay(courses);
        }
      }
    }
    main();
  }, []);

  return (
    <div className="mt-10 w-screen flex flex-col items-center h-content mb-20">
      <FiltrosPropuestas propuestas={database} onSendData={handleFilterData} />
      <h3 className="text-4xl w-full pl-10 mt-10"> {coursesDisplay.length} Resultados:</h3>
      <div className="w-full justify-items-center grid grid-cols-3 gap-5 px-10 h-content mt-10">
        {coursesDisplay?.map((course, index) => (
          <div key={course?.title}>
            <div
              className={
                course && course.recommended
                  ? "border border-green-700 bg-black rounded-xl px-10 py-8 flex flex-col items-center h-140 justify-between text-lg"
                  : "border border-white bg-black rounded-xl px-10 py-8 flex flex-col items-center h-140 justify-between text-lg"
              }
            >
              <div className="flex flex-col justify-center w-full items-center gap-3">
                {course && course.recommended ? (
                  <div className="w-full -mt-8">
                    <p className=" bg-green-700 w-fit rounded-b-xl px-4 text-sm">Recomendado para ti!</p>
                  </div>
                ) : (
                  <></>
                )}
                <h5 className="text-3xl text-center font-semibold">{course?.title}</h5>
                <h6 className="text-sm flex flex-row gap-x-1">
                  <span className="first-letter:uppercase">{course.type} </span> de nivel {course?.level} ofrecido por {course.institute}
                </h6>
                <div className="w-9/10 flex flex-wrap gap-2 justify-center">
                  {course?.skills.map((skill) => (
                    <button key={skill} className="border border-white rounded-xl text-sm h-6 px-3">
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              <p className="px-text-justify mt-4">Descripcion: {course?.description}</p>
              <div className="w-11/12 mt-3 flex flex-col bg-zinc-900 py-3 rounded-xl justify-center  align-middle items-center">
                <div className="w-full flex flex-row gap-3 justify-center">
                  <p>Duracion total: {course?.duration_hours} hs</p>
                  <p>Modalidad: {course?.modality.charAt(0).toUpperCase() + course.modality.slice(1)}</p>
                </div>
                {course?.payment.type == "mensual" ? <p>Pagos mensuales de ${course.payment.price_per_month} USD</p> : <p>Pago unico de ${course?.payment.total_price} USD</p>}
              </div>
              <div className="w-full flex justify-end my-2">
                {course.reviews.length > 0 ? (
                  <div>
                    {course?.reviews.length != 1 ? (
                      <p>
                        ★ {`${course?.stars}/5`} ({`${course?.reviews.length} reseñas`})
                      </p>
                    ) : (
                      <p>
                        ★ {`${course.stars}/5`} ({`${course?.reviews.length} reseña`})
                      </p>
                    )}
                  </div>
                ) : (
                  <div>Sin reseñas</div>
                )}
              </div>
              <div className="w-full flex justify-end">
                <Link href={`/cursos/${String(course?.id)}`} className="underline">
                  {"Obtener Informacion →"}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
