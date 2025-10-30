"use client";
import { Course, Review, User } from "@/types";
import { useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";
import { getStarsCount } from "@/utils/setStars";
import toast, { Toaster } from "react-hot-toast";

export default function Propuesta({ id }: { id: string }) {
  const [propuesta, setPropuesta] = useState<Course>();
  const [addReviewComponent, setAddReviewComponent] = useState<boolean>();
  const [stars, setStars] = useState<number>(0);
  const [starsPromedio, setStarsPromedio] = useState<number | undefined>();
  const [review, setReview] = useState<string>();
  const [incompleteComponent, setIncompleteComponent] = useState<boolean>(false);
  const [user, setUser] = useState<User | undefined>();

  function handleStars(rating: number) {
    setStars(rating);
  }

  function handleStarsReset() {
    setStars(0);
  }

  function handleReviewText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setReview(e.target.value);
  }

  function handleCourseCompleted() {
    if (!propuesta) return;

    if (user?.info) {
      const currentId = Number(id);
      const nextCompleted = Array.from(new Set([...(user.completed_courses ?? []), currentId]));

      const nextUser: User = {
        ...user,
        completed_courses: nextCompleted,
      };

      localStorage.setItem("user", JSON.stringify(nextUser));
      setUser(nextUser);

      toast.success("Curso marcado como completado. Ahora puedes dejar una reseña del mismo.");
    } else {
      toast.error("No tienes informacion de usuario. Por favor agrega tu usuario y vuelve a intentarlo");
    }
  }

  function addReview() {
    if (stars && review) {
      const propuestas: Array<Course> = JSON.parse(localStorage.getItem("db") as string);
      const reviewobj: Review = {
        username: user?.info?.user_name ? user?.info?.user_name : "",
        stars: stars,
        review: review ? review : "",
      };
      propuestas[parseInt(id)].reviews.push(reviewobj);
      const starsValue: number = getStarsCount(propuestas[parseInt(id)].reviews);
      propuestas[parseInt(id)].stars = starsValue;
      localStorage.setItem("db", JSON.stringify(propuestas));
      window.location.reload();
    } else {
      setIncompleteComponent(true);
    }
  }

  useEffect(() => {
    async function main() {
      if (stars > 0 && review && review.length > 15) {
        setIncompleteComponent(false);
      }
    }
    main();
  }, [stars, review]);

  useEffect(() => {}, [user]);

  useEffect(() => {
    async function main() {
      const raw: string | null = localStorage.getItem("db") as string;
      const parsed: Array<Course> = await JSON.parse(raw);
      setPropuesta(parsed[Number(id)]);

      const rawUser: string | null = localStorage.getItem("user") as string;
      const parsedUser = await JSON.parse(rawUser);

      if (parsed[Number(id)].reviews && parsed[Number(id)].reviews.length > 0) {
        const starsValue: number = getStarsCount(parsed[parseInt(id)].reviews);
        setStarsPromedio(starsValue);
      }
      setUser(parsedUser);
    }
    main();
  }, []);

  const tooltipArray = ["0.5 Estrellas", "1 Estrellas", "1.5 Estrellas", "2 Estrellas", "2.5 Estrellas", "3 Estrellas", "3.5 Estrellas", "4 Estrellas", "4.5 Estrellas", "5 Estrellas"];
  const fillColorArray = ["#f17a45", "#f17a45", "#f19745", "#f19745", "#f1a545", "#f1a545", "#f1b345", "#f1b345", "#f1d045", "#f1d045"];

  return (
    <div className="w-full">
      {propuesta ? (
        <div>
          <h3 className="text-4xl mt-20 ml-5">
            {propuesta.title} - {propuesta.profession}
          </h3>
          <div className="w-screen flex-col justify-center items-center align-middle h-content my-10">
            <div className="flex flex-col w-full items-center px-5 lg:flex-row md:flex-row lg:items-start md:items-start lg:px-0 md:lg:px-0">
              <div className="w-full bg-black rounded h-fit py-8 mx-3 px-8 flex flex-col gap-10 lg:w-3/5 md:w-3/5">
                <div className="flex gap-3 flex-col">
                  <h5 className="text-3xl">Descripcion: </h5>
                  <p className="text-lg pr-5">{propuesta.description}</p>
                </div>
                <div className="flex gap-3 flex-col">
                  <h5 className="text-3xl ">Perfil profesional una vez completado el {propuesta.type}:</h5>
                  <p className="text-lg pr-5">{propuesta.professional_profile}</p>
                </div>
                <div className="flex gap-3 flex-col">
                  <h5 className="text-3xl ">Habilidades que desarrollaras:</h5>
                  <div className="w-full flex flex-wrap pr-5 gap-3">
                    {propuesta.skills.map((skill, index) => (
                      <p key={index} className="w-fit flex flex-row items-center text-lg border border-white rounded-xl px-3 h-10">
                        {skill}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 flex-col">
                  <h5 className="text-3xl ">Duracion total y modalidad de cursada:</h5>
                  <p className="text-lg pr-5">
                    {propuesta.duration_hours}hs con una carga horaria promedio de {propuesta.week_charge}hs semanales. La modalidad de cursada es {propuesta.modality}.
                  </p>
                </div>
                {user?.completed_courses && user?.completed_courses.includes(Number(id)) ? (
                  <div className="w-full flex justify-end">
                    <button className="cursor-default w-fit h-fit filterbutton bg-zinc-800 text-zinc-400">Ya te anotaste a este {propuesta.type}</button>
                  </div>
                ) : (
                  <div className="w-full flex justify-end">
                    <button onClick={handleCourseCompleted} className="hover:border-green-700 hover:-translate-y-0.5 transition ease-in-out duration-100 w-fit filterbutton h-10">
                      Anotate ahora!
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-col w-full mx-3 items-center rounded h-fit px-0 gap-5 my-5 lg:my-0 md:my-0 lg:px-9 md:px-9 lg:w-2/5 md:w-2/5">
                {addReviewComponent ? (
                  <div className="w-full mb-6">
                    <div className="bg-zinc-800 flex flex-col py-6 rounded-lg px-10 w-full gap-5 border-2 border-zinc-400">
                      <div className="w-full flex justify-end">
                        <button onClick={() => setAddReviewComponent(false)} className="text-sm w-5 flex items-center justify-center bg-white text-black rounded-full">
                          X
                        </button>
                      </div>
                      <h4>Que te parecio este curso/carrera?</h4>
                      <div className="flex flex-row">
                        <Rating
                          onClick={handleStars}
                          size={50}
                          transition
                          allowFraction
                          showTooltip
                          initialValue={stars}
                          tooltipArray={tooltipArray}
                          fillColorArray={fillColorArray}
                          tooltipDefaultText="Ingresa una calificacion"
                        />
                        {stars ? (
                          <button onClick={handleStarsReset} className="px-2 w-5 text-2xl">
                            ↻
                          </button>
                        ) : (
                          <div className="w-5"></div>
                        )}
                      </div>
                      <textarea
                        value={review}
                        onChange={handleReviewText}
                        name="review"
                        placeholder="Comentale al resto de estudiantes tu experiencia..."
                        className="h-40 bg-zinc-900 px-4 py-2 rounded"
                      ></textarea>
                      {incompleteComponent ? (
                        <div className="flex justify-end flex-col gap-3">
                          <span className="text-red-600">Asegurate de completar el rating y que tu reseña tenga mas de 15 caracteres</span>
                          <div className="flex justify-end">
                            <button onClick={addReview} className="cursor-default w-auto px-4 py-1 text-zinc-500 text-sm bg-zinc-700 rounded border-zinc-400 border">
                              Enviar reseña
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <button onClick={addReview} className="px-4 py-1 text-sm bg-zinc-900 rounded border-white border">
                            Enviar reseña
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : user?.completed_courses && user?.completed_courses.includes(Number(id)) ? (
                  <div className="w-full flex justify-end">
                    <button onClick={() => setAddReviewComponent(true)} className="filterbutton mr-0 mt-0 h-10 lg:-mt-20 md:-mt-20 lg:mr-10 md:mr-10">
                      Agregar reseña
                    </button>
                  </div>
                ) : (
                  <></>
                )}

                <div className="w-full bg-zinc-900 rounded-lg px-4 py-5">
                  <div>
                    <div className="w-full flex flex-col justify-between pr-0 items-center lg:flex-row md:flex-row lg:pr-2 md:pr-2">
                      <h5 className="text-3xl">Reseñas</h5>
                      {propuesta.reviews.length > 0 ? <p className="w-fit text-2xl">Promedio ★ {starsPromedio}/5</p> : <></>}
                    </div>
                    {propuesta.reviews.length > 0 ? (
                      <div className="mt-4 flex flex-col gap-4 max-h-100 overflow-scroll lg:max-h-80 md:max-h-80">
                        {propuesta.reviews.map((review, index) => (
                          <div key={index} className=" bg-zinc-800 rounded-xl py-4 px-10">
                            <div className="flex flex-row justify-between mb-2">
                              <p>{review?.username}</p>
                              <p>★ {review?.stars}/5</p>
                            </div>
                            <p className="italic">
                              {'"'}
                              {review?.review}
                              {'"'}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4 text-lg">Todavia no hay reseñas sobre este {propuesta.type}, se el primer usuario en escribir una!</div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col mt-8 w-full bg-zinc-800 rounded-lg px-4 py-5 mx-3 gap-5">
                  <h6 className="text-3xl mb-2">Informacion de pago</h6>
                  <p className="text-xl">
                    Modalidad de pago: <span className="text-xl">{propuesta.payment.type}</span>
                  </p>
                  {propuesta.payment.price_per_month ? (
                    <p className="text-xl">
                      Cuotas mensuales de: <span className="text-xl">${propuesta.payment.price_per_month} USD cada una</span>
                    </p>
                  ) : (
                    <></>
                  )}
                  <p className="text-xl">
                    Precio total: <span>${propuesta.payment.total_price} USD</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <Toaster
        toastOptions={{
          style: {
            width: "fit-content",
            paddingInline: "2vw",
            maxWidth: "80%",
          },
        }}
      />
    </div>
  );
}
