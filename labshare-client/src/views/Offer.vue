<i18n>
{
  "en": {
    "equip": "Search for devices",
    "advice": "Search for advices",
    "humans": "Search for volunteers",
    "request": "File a Request",
    "success": "Saved successfully"
  },
  "de": {
    "equip": "Suche nach Geräten",
    "advice": "Suche nach Wissen",
    "humans": "Suche nach Freiwilligen Helfern",
    "request": "Anfrage stellen",
    "success": "Erfolgreich gespeichert"
  }
}
</i18n>

<template>
  <div>
    <template v-if="updated || error">
      <b-alert v-if="updated" variant="success" show>{{ $t('success') }}</b-alert>
      <b-alert v-if="error" variant="error" show>{{ $(errorMsg) }}</b-alert>
		</template>
    
    <b-form>
      <Offer v-model="lookingFor" @submit="submit"></Offer>
    </b-form>
    
  </div>
</template>

<script>
import Offer from "@/components/Offer"

export default {
  props: {},
  data() {
    return {
      lookingFor: {
        volunteerSkills: [],
        equipment: [],
        advice: []
      },
      updated: false,
      error: false,
      errorMsg: ""
    };
  },
  methods: {
    submit: function() {
      this.$http.post('profile', { 
					lookingFor: this.lookingFor
				}).then(() => {
					return this.$store.dispatch('getProfile')
        }).then(() => {
          this.updated = true;
					this.error = false;
        }).catch(error => {
          this.error = true;
          this.errorMsg = error.body.errorDescription;
					this.updated = false;
				});
    }
  },
  mounted: function() {
    if (this.$user && this.$user.lookingFor) {
      this.lookingFor = this.$user.lookingFor
    }
    else {
      this.$root.$once("gotProfile", (profile) => {
        if (profile.lookingFor) {
          this.lookingFor = profile.lookingFor
        }
      })
    }
  },
  components: {
    Offer
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
