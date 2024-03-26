import { Temporal } from "@js-temporal/polyfill";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedId = (pattern = "0") =>
  `00000000-1111-2222-3333-${pattern.repeat(12).slice(0, 12)}`;

async function main() {
  const now = Temporal.Now.plainDateTimeISO();

  const seeder = await prisma.user.upsert({
    create: {
      email: "seeder@prisma.orm",
      firstName: "Seeder",
      id: seedId(),
      idDwbn: "1",
      idTelegramChat: -1,
      idUserCreator: seedId(),
      idUserUpdater: seedId(),
      isAdmin: false,
      type: "ADULT",
    },
    update: {},
    where: { id: seedId() },
  });

  const geoPoint = await prisma.geoPoint.upsert({
    create: {
      id: seedId(),
      idUser: seeder.id,
      idUserCreator: seeder.id,
      idUserUpdater: seeder.id,
      latitude: 55.356941,
      longitude: 60.480036,
      name: "Главный дом Аргази",
    },
    update: {},
    where: { id: seedId() },
  });

  const place = await prisma.place.upsert({
    create: {
      id: seedId(),
      idGeoPoint: geoPoint.id,
      idUserCreator: seeder.id,
      idUserUpdater: seeder.id,
      name: "РЦ Аргази",
    },
    update: {},
    where: { id: seedId() },
  });

  const pastEvent = await prisma.event.upsert({
    create: {
      dateAnnouncement: new Date(now.subtract({ days: 7 }).toString()),
      dateDeadline: new Date(now.subtract({ days: 5 }).toString()),
      dateFinish: new Date(now.subtract({ days: 1 }).toString()),
      dateStart: new Date(now.subtract({ days: 3 }).toString()),
      id: seedId("0"),
      idPlace: place.id,
      idUserCreator: seeder.id,
      idUserUpdater: seeder.id,
      name: "Прошедшее событие",
      priceDay: 100,
      priceEvent: 200,
    },
    update: {},
    where: { id: seedId("0") },
  });

  const upcomingEvent = await prisma.event.upsert({
    create: {
      dateAnnouncement: new Date(),
      dateDeadline: new Date(now.add({ days: 3 }).toString()),
      dateFinish: new Date(now.add({ days: 7 }).toString()),
      dateStart: new Date(now.add({ days: 5 }).toString()),
      id: seedId("1"),
      idPlace: place.id,
      idUserCreator: seeder.id,
      idUserUpdater: seeder.id,
      name: "Предстоящее событие",
      priceDay: 100,
      priceEvent: 200,
    },
    update: {
      dateAnnouncement: new Date(),
      dateDeadline: new Date(now.add({ days: 3 }).toString()),
      dateFinish: new Date(now.add({ days: 7 }).toString()),
      dateStart: new Date(now.add({ days: 5 }).toString()),
    },
    where: { id: seedId("1") },
  });

  console.log({ geoPoint, pastEvent, place, seeder, upcomingEvent });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
