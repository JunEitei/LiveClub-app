<template>
  <v-container>
    <v-form @submit.prevent="createLiveEvent">
      <v-text-field
        v-model="liveTitle"
        label="Live Title"
        required
      ></v-text-field>
      <v-text-field
        v-model="liveDescription"
        label="Description"
        required
      ></v-text-field>
      <v-text-field
        v-model="startTime"
        label="Start Time"
        required
      ></v-text-field>
      <v-text-field
        v-model="endTime"
        label="End Time"
        required
      ></v-text-field>
      <v-text-field
        v-model="liveLocationName"
        label="Location Name"
        required
      ></v-text-field>
      <v-text-field
        v-model="liveLocationAddress"
        label="Location Address"
        required
      ></v-text-field>
      <v-text-field
        v-model="liveLink"
        label="Link"
        required
      ></v-text-field>
      <v-text-field
        v-model="ticketPrice"
        label="Ticket Price"
        type="number"
        required
      ></v-text-field>
      <v-text-field
        v-model="liveType"
        label="Live Type"
        required
      ></v-text-field>
      <v-text-field
        v-model="organizer"
        label="Organizer"
        required
      ></v-text-field>
      <v-text-field
        v-model="contactPhone"
        label="Contact Phone"
        required
      ></v-text-field>
      <v-checkbox
        v-model="publicFlag"
        label="Public Event"
      ></v-checkbox>
      <v-checkbox
        v-model="cancelledFlag"
        label="Cancelled Event"
      ></v-checkbox>
      <v-text-field
        v-model="audienceLimit"
        label="Audience Limit"
        type="number"
        required
      ></v-text-field>
      <v-btn type="submit" color="primary" block>Create Live Event</v-btn>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const router = useRouter();

    const liveTitle = ref('');
    const liveDescription = ref('');
    const startTime = ref('');
    const endTime = ref('');
    const liveLocationName = ref('');
    const liveLocationAddress = ref('');
    const liveLink = ref('');
    const ticketPrice = ref(0);
    const liveType = ref('');
    const organizer = ref('');
    const contactPhone = ref('');
    const publicFlag = ref(false);
    const cancelledFlag = ref(false);
    const audienceLimit = ref(0);

    // Create live event
    const createLiveEvent = async () => {
      const live = {
        liveTitle: liveTitle.value,
        liveDescription: liveDescription.value,
        startTime: startTime.value,
        endTime: endTime.value,
        liveLocationName: liveLocationName.value,
        liveLocationAddress: liveLocationAddress.value,
        liveLink: liveLink.value,
        ticketPrice: ticketPrice.value,
        liveType: liveType.value,
        organizer: organizer.value,
        contactPhone: contactPhone.value,
        publicFlag: publicFlag.value,
        cancelledFlag: cancelledFlag.value,
        audienceLimit: audienceLimit.value,
      };

      try {
        const response = await fetch(`${apiUrl}/live/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(live),
        });

        if (!response.ok) {
          throw new Error('Failed to create live event');
        }

        const data = await response.json();
        console.log('Live event created:', data);
        router.push('/');
      } catch (error) {
        console.error('Error creating live event:', error);
      }
    };

    return {
      liveTitle,
      liveDescription,
      startTime,
      endTime,
      liveLocationName,
      liveLocationAddress,
      liveLink,
      ticketPrice,
      liveType,
      organizer,
      contactPhone,
      publicFlag,
      cancelledFlag,
      audienceLimit,
      createLiveEvent,
    };
  },
});
</script>

<style scoped>
.v-container {
  max-width: 600px;
  margin: auto;
  padding-top: 20px;
}
</style>