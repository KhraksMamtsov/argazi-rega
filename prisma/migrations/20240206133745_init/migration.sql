-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('REGULAR', 'VEGITERIAN');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADULT', 'STUDENT', 'PENSIONER');

-- CreateEnum
CREATE TYPE "VisitorType" AS ENUM ('ADULT', 'STUDENT', 'CHILD', 'PENSIONER');

-- CreateEnum
CREATE TYPE "TicketRole" AS ENUM ('ADMIN', 'LEAD', 'CHIEF', 'CASHIER', 'NONE');

-- CreateTable
CREATE TABLE "GeoPoint" (
    "id" UUID NOT NULL,
    "idUser" UUID NOT NULL,
    "name" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "GeoPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Place" (
    "id" UUID NOT NULL,
    "idGeoPoint" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" UUID NOT NULL,
    "idPlace" UUID NOT NULL,
    "idUser" UUID NOT NULL,
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL,
    "idPlace" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateFinish" TIMESTAMP(3) NOT NULL,
    "dateDeadline" TIMESTAMPTZ(3) NOT NULL,
    "priceDay" MONEY NOT NULL,
    "priceEvent" MONEY NOT NULL,
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lecture" (
    "id" UUID NOT NULL,
    "idEvent" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateFinish" TIMESTAMP(3),
    "price" MONEY NOT NULL,
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "Lecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "id" UUID NOT NULL,
    "idEvent" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "MealType" NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateFinish" TIMESTAMP(3),
    "price" MONEY NOT NULL,
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaceAdmin" (
    "id" UUID NOT NULL,
    "idUser" UUID NOT NULL,
    "idPlace" UUID NOT NULL,
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "PlaceAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "idDwbn" TEXT NOT NULL,
    "idTelegramChat" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "isAdmin" BOOLEAN NOT NULL,
    "type" "UserType" NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "idUserDeleter" UUID,
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visitor" (
    "id" UUID NOT NULL,
    "idUser" UUID NOT NULL,
    "email" TEXT,
    "name" TEXT NOT NULL,
    "type" "VisitorType" NOT NULL,
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transport" (
    "id" UUID NOT NULL,
    "idUser" UUID NOT NULL,
    "number" TEXT NOT NULL,
    "model" TEXT,
    "color" TEXT NOT NULL,
    "seatsNumber" INTEGER NOT NULL,
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "Transport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransportOnEvent" (
    "id" UUID NOT NULL,
    "idTransport" UUID NOT NULL,
    "idEvent" UUID NOT NULL,
    "price" MONEY NOT NULL,
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "TransportOnEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteTo" (
    "id" UUID NOT NULL,
    "idGeoPoint" UUID NOT NULL,
    "idTransportOnEvent" UUID NOT NULL,
    "name" TEXT,
    "dateStart" TIMESTAMP(3),
    "dateFinish" TIMESTAMP(3),
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "RouteTo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteFrom" (
    "id" UUID NOT NULL,
    "idGeoPoint" UUID NOT NULL,
    "idTransportOnEvent" UUID NOT NULL,
    "name" TEXT,
    "dateStart" TIMESTAMP(3),
    "dateFinish" TIMESTAMP(3),
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "RouteFrom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" UUID NOT NULL,
    "idUser" UUID NOT NULL,
    "idEvent" UUID NOT NULL,
    "idTransport" UUID,
    "role" "TicketRole" NOT NULL,
    "dateRegistered" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketPayment" (
    "id" UUID NOT NULL,
    "idTicket" UUID NOT NULL,
    "idCashier" UUID NOT NULL,
    "payed" MONEY NOT NULL,
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "TicketPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketPaymentToPlaceAdmin" (
    "id" UUID NOT NULL,
    "idTicket" UUID NOT NULL,
    "idPlaceAdmin" UUID NOT NULL,
    "payed" MONEY NOT NULL,
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "TicketPaymentToPlaceAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketMeal" (
    "id" UUID NOT NULL,
    "idTicket" UUID NOT NULL,
    "idMeal" UUID NOT NULL,
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "TicketMeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketLecture" (
    "id" UUID NOT NULL,
    "idTicket" UUID NOT NULL,
    "idLecture" UUID NOT NULL,
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "TicketLecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visa" (
    "id" UUID NOT NULL,
    "idVisitor" UUID NOT NULL,
    "idTicket" UUID NOT NULL,
    "idTransport" UUID,
    "dateRegistered" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "Visa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaMeal" (
    "id" UUID NOT NULL,
    "idVisa" UUID NOT NULL,
    "idMeal" UUID NOT NULL,
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "VisaMeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaPayment" (
    "id" UUID NOT NULL,
    "idVisa" UUID NOT NULL,
    "idGuarantor" UUID NOT NULL,
    "payed" MONEY NOT NULL,
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "VisaPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaLecture" (
    "id" UUID NOT NULL,
    "idVisa" UUID NOT NULL,
    "idLecture" UUID NOT NULL,
    "dateCreated" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMPTZ(3) NOT NULL,
    "idUserCreator" UUID NOT NULL,
    "idUserUpdater" UUID NOT NULL,
    "dateDeleted" TIMESTAMPTZ(3),
    "idUserDeleter" UUID,

    CONSTRAINT "VisaLecture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_idDwbn_key" ON "User"("idDwbn");

-- CreateIndex
CREATE UNIQUE INDEX "User_idTelegramChat_key" ON "User"("idTelegramChat");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_email_key" ON "Visitor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Transport_number_key" ON "Transport"("number");

-- CreateIndex
CREATE UNIQUE INDEX "RouteTo_idTransportOnEvent_key" ON "RouteTo"("idTransportOnEvent");

-- CreateIndex
CREATE UNIQUE INDEX "RouteFrom_idTransportOnEvent_key" ON "RouteFrom"("idTransportOnEvent");

-- AddForeignKey
ALTER TABLE "GeoPoint" ADD CONSTRAINT "GeoPoint_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "GeoPoint" ADD CONSTRAINT "GeoPoint_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "GeoPoint" ADD CONSTRAINT "GeoPoint_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "GeoPoint" ADD CONSTRAINT "GeoPoint_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_idGeoPoint_fkey" FOREIGN KEY ("idGeoPoint") REFERENCES "GeoPoint"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_idPlace_fkey" FOREIGN KEY ("idPlace") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_idPlace_fkey" FOREIGN KEY ("idPlace") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_idEvent_fkey" FOREIGN KEY ("idEvent") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Lecture" ADD CONSTRAINT "Lecture_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_idEvent_fkey" FOREIGN KEY ("idEvent") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "PlaceAdmin" ADD CONSTRAINT "PlaceAdmin_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceAdmin" ADD CONSTRAINT "PlaceAdmin_idPlace_fkey" FOREIGN KEY ("idPlace") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceAdmin" ADD CONSTRAINT "PlaceAdmin_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "PlaceAdmin" ADD CONSTRAINT "PlaceAdmin_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "PlaceAdmin" ADD CONSTRAINT "PlaceAdmin_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Transport" ADD CONSTRAINT "Transport_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Transport" ADD CONSTRAINT "Transport_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Transport" ADD CONSTRAINT "Transport_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Transport" ADD CONSTRAINT "Transport_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TransportOnEvent" ADD CONSTRAINT "TransportOnEvent_idTransport_fkey" FOREIGN KEY ("idTransport") REFERENCES "Transport"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TransportOnEvent" ADD CONSTRAINT "TransportOnEvent_idEvent_fkey" FOREIGN KEY ("idEvent") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TransportOnEvent" ADD CONSTRAINT "TransportOnEvent_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TransportOnEvent" ADD CONSTRAINT "TransportOnEvent_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TransportOnEvent" ADD CONSTRAINT "TransportOnEvent_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "RouteTo" ADD CONSTRAINT "RouteTo_idGeoPoint_fkey" FOREIGN KEY ("idGeoPoint") REFERENCES "GeoPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteTo" ADD CONSTRAINT "RouteTo_idTransportOnEvent_fkey" FOREIGN KEY ("idTransportOnEvent") REFERENCES "TransportOnEvent"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "RouteTo" ADD CONSTRAINT "RouteTo_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "RouteTo" ADD CONSTRAINT "RouteTo_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "RouteTo" ADD CONSTRAINT "RouteTo_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "RouteFrom" ADD CONSTRAINT "RouteFrom_idGeoPoint_fkey" FOREIGN KEY ("idGeoPoint") REFERENCES "GeoPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteFrom" ADD CONSTRAINT "RouteFrom_idTransportOnEvent_fkey" FOREIGN KEY ("idTransportOnEvent") REFERENCES "TransportOnEvent"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "RouteFrom" ADD CONSTRAINT "RouteFrom_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "RouteFrom" ADD CONSTRAINT "RouteFrom_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "RouteFrom" ADD CONSTRAINT "RouteFrom_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_idEvent_fkey" FOREIGN KEY ("idEvent") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_idTransport_fkey" FOREIGN KEY ("idTransport") REFERENCES "TransportOnEvent"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TicketPayment" ADD CONSTRAINT "TicketPayment_idTicket_fkey" FOREIGN KEY ("idTicket") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TicketPayment" ADD CONSTRAINT "TicketPayment_idCashier_fkey" FOREIGN KEY ("idCashier") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TicketPayment" ADD CONSTRAINT "TicketPayment_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TicketPayment" ADD CONSTRAINT "TicketPayment_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TicketPayment" ADD CONSTRAINT "TicketPayment_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TicketPaymentToPlaceAdmin" ADD CONSTRAINT "TicketPaymentToPlaceAdmin_idTicket_fkey" FOREIGN KEY ("idTicket") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TicketPaymentToPlaceAdmin" ADD CONSTRAINT "TicketPaymentToPlaceAdmin_idPlaceAdmin_fkey" FOREIGN KEY ("idPlaceAdmin") REFERENCES "PlaceAdmin"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TicketPaymentToPlaceAdmin" ADD CONSTRAINT "TicketPaymentToPlaceAdmin_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TicketPaymentToPlaceAdmin" ADD CONSTRAINT "TicketPaymentToPlaceAdmin_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TicketPaymentToPlaceAdmin" ADD CONSTRAINT "TicketPaymentToPlaceAdmin_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TicketMeal" ADD CONSTRAINT "TicketMeal_idTicket_fkey" FOREIGN KEY ("idTicket") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TicketMeal" ADD CONSTRAINT "TicketMeal_idMeal_fkey" FOREIGN KEY ("idMeal") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TicketMeal" ADD CONSTRAINT "TicketMeal_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TicketMeal" ADD CONSTRAINT "TicketMeal_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TicketMeal" ADD CONSTRAINT "TicketMeal_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TicketLecture" ADD CONSTRAINT "TicketLecture_idTicket_fkey" FOREIGN KEY ("idTicket") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TicketLecture" ADD CONSTRAINT "TicketLecture_idLecture_fkey" FOREIGN KEY ("idLecture") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TicketLecture" ADD CONSTRAINT "TicketLecture_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TicketLecture" ADD CONSTRAINT "TicketLecture_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "TicketLecture" ADD CONSTRAINT "TicketLecture_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Visa" ADD CONSTRAINT "Visa_idVisitor_fkey" FOREIGN KEY ("idVisitor") REFERENCES "Visitor"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Visa" ADD CONSTRAINT "Visa_idTicket_fkey" FOREIGN KEY ("idTicket") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Visa" ADD CONSTRAINT "Visa_idTransport_fkey" FOREIGN KEY ("idTransport") REFERENCES "TransportOnEvent"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Visa" ADD CONSTRAINT "Visa_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Visa" ADD CONSTRAINT "Visa_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Visa" ADD CONSTRAINT "Visa_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "VisaMeal" ADD CONSTRAINT "VisaMeal_idVisa_fkey" FOREIGN KEY ("idVisa") REFERENCES "Visa"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "VisaMeal" ADD CONSTRAINT "VisaMeal_idMeal_fkey" FOREIGN KEY ("idMeal") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "VisaMeal" ADD CONSTRAINT "VisaMeal_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "VisaMeal" ADD CONSTRAINT "VisaMeal_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "VisaMeal" ADD CONSTRAINT "VisaMeal_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "VisaPayment" ADD CONSTRAINT "VisaPayment_idVisa_fkey" FOREIGN KEY ("idVisa") REFERENCES "Visa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaPayment" ADD CONSTRAINT "VisaPayment_idGuarantor_fkey" FOREIGN KEY ("idGuarantor") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "VisaPayment" ADD CONSTRAINT "VisaPayment_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "VisaPayment" ADD CONSTRAINT "VisaPayment_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "VisaPayment" ADD CONSTRAINT "VisaPayment_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "VisaLecture" ADD CONSTRAINT "VisaLecture_idVisa_fkey" FOREIGN KEY ("idVisa") REFERENCES "Visa"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "VisaLecture" ADD CONSTRAINT "VisaLecture_idLecture_fkey" FOREIGN KEY ("idLecture") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "VisaLecture" ADD CONSTRAINT "VisaLecture_idUserCreator_fkey" FOREIGN KEY ("idUserCreator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "VisaLecture" ADD CONSTRAINT "VisaLecture_idUserUpdater_fkey" FOREIGN KEY ("idUserUpdater") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "VisaLecture" ADD CONSTRAINT "VisaLecture_idUserDeleter_fkey" FOREIGN KEY ("idUserDeleter") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
