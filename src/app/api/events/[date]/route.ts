import { getEvents } from "./getEvents";

export const GET = async (request: Request, { params }: { params: { date: string } }) => {
  // validate date: YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(params.date)) {
    return Response.redirect("/api/events");
  }
  return Response.json(await getEvents(params.date));
}