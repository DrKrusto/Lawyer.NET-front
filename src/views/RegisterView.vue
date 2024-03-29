<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import RegistrationUserModel from "@/models/RegistrationUserModel";
import { Ref, ref } from "vue";
import VLabel from "@/components/atoms/VLabel.vue";
import LabelTypes from "@/constants/LabelTypes";
import * as Yup from "yup";
import UserRoles from "@/constants/UserRoles";
import { useCountryStore } from "@/stores/CountryStore";
import router from "@/router";

const userStore = useUserStore();
const countryStore = useCountryStore();
countryStore.fetchCountries();

const customGender = ref("");

const schema = Yup.object().shape({
  salutation: Yup.string().required("Salutation is required"),
  countryCode: Yup.string().required("Country is required"),
  username: Yup.string()
    .min(5, "Username must be at least 5 characters long")
    .required("Username is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  password: Yup.string()
    .min(12, "Password must be at least 12 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must include a mix of uppercase and lowercase letters, numbers, and symbols"
    )
    .required("Password is required"),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref("password")],
    "Passwords must match"
  ),
});

const userForm: Ref<RegistrationUserModel> = ref({
  salutation: "",
  countryCode: "",
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  role: UserRoles.USER,
});

const validationErrors: Ref<{ [id: string]: string }> = ref({
  salutation: "",
  countryCode: "",
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordConfirmation: "",
});

function onRegister() {
  schema
    .validate(userForm.value, { abortEarly: false })
    .then(() => {
      if (
        customGender.value !== "" &&
        userForm.value.salutation !== "male" &&
        userForm.value.salutation !== "female"
      ) {
        userForm.value.salutation = customGender.value;
      }

      userStore.createUser(userForm.value).then(() => {
        router.push({ name: "Login" });
      });    })
    .catch((err: Yup.ValidationError) => {
      err.inner.forEach((e) => {
        if (e.path) validationErrors.value[e.path] = e.message;
      });
    });
}

function validate(field: string) {
  schema
    .validateAt(field, userForm.value)
    .then(() => (validationErrors.value[field] = ""))
    .catch((err) => {
      validationErrors.value[err.path] = err.message;
    });
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-xs mt-8">
      <h2 class="mb-6 text-2xl font-bold text-center text-gray-700">
        Register
      </h2>
      <form
        @submit.prevent="onRegister"
        class="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md"
      >
        <fieldset class="mb-4">
          <label class="block mb-2 text-sm font-bold text-gray-700"
            >Salutation:</label
          >

          <div class="flex mb-4">
            <div class="mr-4">
              <input
                type="radio"
                class="form-radio h-4 w-4 text-indigo-600 border-2 border-indigo-600 focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500"
                id="male"
                v-model="userForm.salutation"
                value="male"
                @blur="validate('salutation')"
              />
              <label for="male" class="ml-1 text-gray-700">Male</label>
            </div>

            <div class="mr-4">
              <input
                type="radio"
                class="form-radio h-4 w-4 text-indigo-600 border-2 border-indigo-600 focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500"
                id="female"
                v-model="userForm.salutation"
                value="female"
                @blur="validate('salutation')"
              />
              <label for="female" class="ml-1 text-gray-700">Female</label>
            </div>

            <div>
              <input
                type="radio"
                class="form-radio h-4 w-4 text-indigo-600 border-2 border-indigo-600 focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500"
                id="other"
                v-model="userForm.salutation"
                value="other"
                @blur="validate('salutation')"
              />
              <label for="other" class="ml-1 text-gray-700">Other</label>
            </div>
          </div>
          <div v-if="userForm.salutation === 'other'" class="mb-4">
            <input
              type="text"
              id="customGender"
              v-model="customGender"
              class="mt-1 p-2 w-full border rounded-md"
              placeholder="Enter your gender"
              required
              maxlength="30"
            />
          </div>
          <v-label
            :label-type="LabelTypes.DANGER"
            class="text-xs"
            v-if="validationErrors.salutation"
            >{{ validationErrors.salutation }}</v-label
          >
        </fieldset>
        <div class="mb-4">
          <label
            class="block mb-2 text-sm font-bold text-gray-700"
            for="username"
            >Username:</label
          >
          <input
            class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            id="username"
            v-model="userForm.username"
            @blur="validate('username')"
          />
          <v-label
            :label-type="LabelTypes.DANGER"
            class="text-xs"
            v-if="validationErrors.username"
            >{{ validationErrors.username }}</v-label
          >
        </div>
        <div class="mb-4">
          <label class="block mb-2 text-sm font-bold text-gray-700" for="email"
            >Email:</label
          >
          <input
            class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            type="text"
            id="email"
            v-model="userForm.email"
            @blur="validate('email')"
          />
          <v-label
            :label-type="LabelTypes.DANGER"
            class="text-xs"
            v-if="validationErrors.email"
            >{{ validationErrors.email }}</v-label
          >
        </div>
        <div class="mb-4">
          <label
            class="block mb-2 text-sm font-bold text-gray-700"
            for="password"
            >Password:</label
          >
          <input
            class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            type="password"
            id="password"
            v-model="userForm.password"
            @blur="validate('password')"
          />
          <v-label
            :label-type="LabelTypes.DANGER"
            class="text-xs"
            v-if="validationErrors.password"
            >{{ validationErrors.password }}</v-label
          >
        </div>
        <div class="mb-4">
          <label
            class="block mb-2 text-sm font-bold text-gray-700"
            for="passwordConfirmation"
            >Confirm Password:</label
          >
          <input
            class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            type="password"
            id="passwordConfirmation"
            v-model="userForm.passwordConfirmation"
            @blur="validate('passwordConfirmation')"
          />
          <v-label
            :label-type="LabelTypes.DANGER"
            class="text-xs"
            v-if="validationErrors.passwordConfirmation"
            >{{ validationErrors.passwordConfirmation }}</v-label
          >
        </div>
        <div class="mb-4">
          <label class="block mb-2 text-sm font-bold text-gray-700" for="name"
            >First Name:</label
          >
          <input
            class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            type="text"
            id="name"
            v-model="userForm.firstName"
            @blur="validate('firstName')"
          />
          <v-label
            :label-type="LabelTypes.DANGER"
            class="text-xs"
            v-if="validationErrors.firstName"
            >{{ validationErrors.firstName }}</v-label
          >
        </div>

        <!-- Last Name Field -->
        <div class="mb-6">
          <label
            class="block mb-2 text-sm font-bold text-gray-700"
            for="lastName"
            >Last Name:</label
          >
          <input
            class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            type="text"
            id="lastName"
            v-model="userForm.lastName"
            @blur="validate('lastName')"
          />
          <v-label
            :label-type="LabelTypes.DANGER"
            class="text-xs"
            v-if="validationErrors.lastName"
            >{{ validationErrors.lastName }}</v-label
          >
        </div>
        <div class="mb-4">
          <label
            class="block mb-2 text-sm font-bold text-gray-700"
            for="countryCode"
            >Country:</label
          >
          <select
            class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            id="countryCode"
            v-model="userForm.countryCode"
            @blur="validate('countryCode')"
          >
            <option value="" disabled>Select your country...</option>
            <option v-for="country in countryStore.countries" :key="country">
              {{ country.Code }}
            </option>
          </select>
          <v-label
            :label-type="LabelTypes.DANGER"
            class="text-xs"
            v-if="validationErrors.countryCode"
            >{{ validationErrors.countryCode }}</v-label
          >
        </div>
        <div class="flex items-center justify-between">
          <button
            class="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
