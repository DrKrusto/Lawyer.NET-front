<script setup lang="ts">
import VButton from "@/components/atoms/VButton.vue";
import VLabel from "@/components/atoms/VLabel.vue";
import LawyerSearchModel from "@/models/LawyerSearchModel";
import { useAppointmentStore } from "@/stores/AppointmentStore";
import { parse, format } from "date-fns";
import { defineProps, ref } from "vue";

const props = defineProps<{
  lawyer: LawyerSearchModel;
  date: string;
  timeslots: string[];
}>();

const MIN_TIMESLOTS_SHOWN = 5;

const timeslotsShown = ref(MIN_TIMESLOTS_SHOWN);

const currentTimeslots = ref(props.timeslots);

const appointmentStore = useAppointmentStore();

function getDayOfWeek(date: string) {
  const parsedDate = parse(date, "yyyy-MM-dd", new Date());
  return format(parsedDate, "EEEE");
}

function getFullDay(date: string) {
  const parsedDate = parse(date, "yyyy-MM-dd", new Date());
  return format(parsedDate, "dd MMMM yyyy");
}

function showFullTimetable() {
  timeslotsShown.value = props.timeslots.length;
}

function getEmptySlots(timeslots: string[]) {
  if (timeslots.length < timeslotsShown.value) {
    return Array(timeslotsShown.value - timeslots.length).fill("--:--");
  }
}

function showModal(time: string, date: string, lawyer: LawyerSearchModel) {
  appointmentStore.showAppointment(
    time,
    date,
    lawyer.id,
    `${lawyer.firstName} ${lawyer.lastName}`,
    (isBooked) => {
      if (isBooked) {
        currentTimeslots.value.splice(currentTimeslots.value.indexOf(time), 1);
        timeslotsShown.value = MIN_TIMESLOTS_SHOWN;
      }
    }
  );
}
</script>

<template>
  <div class="flex flex-col place-items-center">
    <v-label class="text-stone-500 font-semibold">{{
      getDayOfWeek(props.date)
    }}</v-label>
    <v-label class="text-sm">{{ getFullDay(props.date) }}</v-label>
    <div class="flex flex-col mt-3 gap-y-2 text-center">
      <div
        v-for="time in currentTimeslots.slice(0, timeslotsShown)"
        :key="time"
      >
        <v-button
          button-type="timeslot"
          @click="showModal(time, props.date, props.lawyer)"
        >
          {{ time }}
        </v-button>
      </div>
      <div v-for="empty in getEmptySlots(currentTimeslots)" :key="empty">
        <div class="font-semibold text-gray-400 px-4 py-0.5">--:--</div>
      </div>
    </div>
    <div class="mt-2">
      <v-button
        v-if="
          currentTimeslots.length > timeslotsShown &&
          timeslotsShown === MIN_TIMESLOTS_SHOWN
        "
        @click="showFullTimetable"
        button-type="link"
      >
        +{{ currentTimeslots.length - timeslotsShown }}
      </v-button>
      <v-button
        v-else-if="timeslotsShown > MIN_TIMESLOTS_SHOWN"
        @click="timeslotsShown = MIN_TIMESLOTS_SHOWN"
        button-type="link"
        >Show less</v-button
      >
    </div>
  </div>
</template>
