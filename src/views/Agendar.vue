<template>
  <layout>    
    <v-snackbar
        v-model="snackbar.active"
      >
        {{ snackbar.text }}

        <template v-slot:action="{ attrs }">
          <v-btn
            color="blue"
            text
            v-bind="attrs"
            @click="snackbar.active = false"
          >
            Fechar
          </v-btn>
        </template>
      </v-snackbar>
    <v-container :fluid="true">


        <v-card class="justify-center">
          <v-img height="150px" :src="`http://localhost/${service.image}`"></v-img> 
          <v-card-title>{{service.name}} (+ R$ {{service.price}})</v-card-title>
        </v-card> 

       <v-divider class="mt-2 mb-2"></v-divider>
        
        <v-card>
          <v-select
            class="pb-0"
            label="Pet"
            outlined
            hide-details=true
            :items="pets"
            item-text="name"
            item-value="id"
            v-model="pet_id"
          ></v-select>
        </v-card>

       <v-divider class="mt-2 mb-2"></v-divider>
        
        <v-card class="justify-center">
          
          <v-card-title>Serviço adicionais</v-card-title>
          <v-card-text>
            <v-checkbox 
              class="my-0"
              v-for="addservice in service.additional_sevices"
              :key="addservice.id"
              :value="addservice.id"
              ref="checkboxAdicinais"
              :label="`${addservice.name} (+ R$ ${addservice.price})`"
              multiple
              v-model="servAdicionais"
            ></v-checkbox>

          </v-card-text>
          
        </v-card> 

       <v-divider class="mt-2 mb-2"></v-divider>

      <v-card class="justify-center">
        <v-date-picker
          v-model="picker"
          :first-day-of-week="1"
          full-width
          :min="min"
          :max="max"
          locale="pt-br"
        ></v-date-picker> 
      </v-card>

      <v-divider class="mt-2 mb-2"></v-divider>



      <v-card class="justify-center">

        <v-row
        v-show="loadingDates"
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-col
          class="subtitle-1 text-center"
          cols="12"
        >
          Buscando horários
        </v-col>
        <v-col cols="6">
          <v-progress-linear
            color="deep-purple accent-4"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
        </v-col>
      </v-row>

        <v-list  v-show="!loadingDates">
      <v-list-item-group
        v-model="selectedDate"
        active-class="border"
        color="indigo"
      >

        <v-list-item
          v-if="times.length <= 0"
          disabled
        >
          <v-list-item-icon>
            <v-icon>mdi-alarm-plus</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Nehuma hora encontrada</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-else
          v-for="(item, i) in times"
          :key="i"
        >
          <v-list-item-icon>
            <v-icon>mdi-alarm-plus</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{item.time}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

      </v-card>

      <v-divider class="mt-2 mb-2"></v-divider>

        <v-card>
        <v-textarea
          hide-details=true
          outlined
          label="Observações"
          v-model="obs"
        ></v-textarea>
        </v-card>
  
      <v-divider class="mt-2 mb-2"></v-divider>
      
      <v-switch
        v-model="taxi_dog"
        :label="`Preciso do Taxi Dog`"
      ></v-switch>

      <v-divider class="mt-2 mb-2"></v-divider>
      <v-chip
        style="display: block; text-align: center"
        class="subtitle-1"
        color="blue"
        text-color="white"
      >{{totalPrice}} - {{strHrs}}</v-chip>
      <v-divider class="mt-2 mb-2"></v-divider>

      <v-btn
          class="py-6 mt-4"
          :disabled="!btnActive"
          color="primary"
          block
          @click="createSchedule"
          
        >
          AGENDAR
          <template v-slot:loader>
            <span class="custom-loader">
              <v-icon light>mdi-cached</v-icon>
            </span>
          </template>
        </v-btn>
     
      <v-overlay :value="overlay">
        <v-row> 
          <v-col class="text-center">
          <v-progress-circular class="mx-auto"
            indeterminate
            size="64"
          ></v-progress-circular>
        </v-col>
        </v-row>
        <v-row>
        <v-col class="text-center">
            Agendando...
          </v-col>
        </v-row>
        
      </v-overlay>
      

      <v-dialog
      v-model="dialog.active"
      persistent
      max-width="500"
    >
      

      <v-card>
        <v-card-title class="headline grey lighten-2">
          <v-icon large class="mr-4">mdi-information</v-icon> Atenção! 
        </v-card-title>


        <v-card-text class="pa-8">
          
          {{dialog.message}}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog.active = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> 

    </v-container>
  </layout>
</template>

<script>
import axios from 'axios';
import layout from './Layout';

  export default {
    
    props: ['id'],
    beforeMount(){

      let date = new Date();
      date.setDate(date.getDate() +60);
      this.max = date.toISOString().substr(0, 10)
      window.scrollTo(0, 0);
      
      const token = localStorage.getItem('token');
        
      axios.get('http://localhost/api/service/' + this.id, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).then(data => {
        this.service = data.data;
        
      }).catch(err => {
        console.log(err);
      })

      axios.get('http://localhost/api/pets', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).then(data => {
        this.pets = data.data;
        
      }).catch(err => {
        console.log(err);
      })

    },
    created(){
      
    },
    mounted(){
      // this.timesUpdate();
    },
    watch: {
      picker(){
        this.timesUpdate();
      },
      pet_id(){
        this.timesUpdate();
      },
      selectedDate(n){
        console.log(n);
        if(n === 0 || n > 0) return this.btnActive = true;
        return this.btnActive = false;
      },
      servAdicionais(n, o){
        console.log(n, o);
        this.timesUpdate();
      }
      // servAdicionais(){
      //   console.log(this.$refs.checkboxAdicinais);
      // }
    },
    data: () => ({
      picker: new Date().toISOString().substr(0, 10),
      min: new Date().toISOString().substr(0, 10),
      max: new Date().toISOString().substr(0, 10),
      btnActive: false,
      loadingDates: false,
      selectedDate: '',
      times: [],
      servAdicionais: [],
      service: {},
      pets: [],
      obs: '',
      overlay: false,
      pet_id: 0,
      snackbar: {
        active: false,
        text: ''
      },
      taxi_dog: false,
      totalPrice: 0,
      strHrs: 0,
      dialog: {
        active: false,
        message: ''
      } 

    }),

    components: {
      layout
    },
    methods: {
      timesUpdate(){
        this.loadingDates = true;
        this.selectedDate = '';
        const token = localStorage.getItem('token');

        axios.get('http://localhost/api/service-schedule/' + this.id + '/' + this.picker + '/' + this.pet_id + '/' + this.servAdicionais.join(','), {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }).then(data => {
          
          if(data.data.success === false){
            // console.log('aaa', data)
            this.snackbar.active = true;
            this.snackbar.text = data.data.message;
            this.loadingDates = false;
            return false;
          }
          this.times = data.data.schedules;
          var formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            // These options are needed to round to whole numbers if that's what you want.
            //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
            //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
          });
          this.totalPrice = formatter.format(data.data.total.price);
          this.totalMinutes = data.data.total.time_minutes;
          this.strHrs = data.data.total.hrs;
          this.loadingDates = false;
        }).catch(err => {
          console.log(err);
          this.loadingDates = false;
        })
      },
      async createSchedule(){
        this.overlay = true;
        const time = this.times[this.selectedDate];
        const form = {
          service_id: this.id,
          date: this.picker,
          time: time.time,
          collaborator_id: time.collaborator_id,
          addServices: this.servAdicionais.join(','),
          obs: this.obs,
          pet_id: this.pet_id,
          taxi_dog: this.taxi_dog,
        }
        const token = localStorage.getItem('token');

        const res = await axios.post('http://localhost/api/service-schedule', form, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });

        this.overlay = false;

        if(res.status != 200){
          this.dialog.message = res.data.message;
          this.dialog.active = true;
          return false;
        }

        if(res.status == 200){
          if(res.data.success === false){
            this.dialog.message = res.data.message;
            this.dialog.message+= res.data.error.join(', ');
            this.dialog.active = true;
            return false;
          }

          this.dialog.message = res.data.message;
          this.dialog.active = true;
          this.$router.push({name: 'Home'});
          return true;
        }

        
      }
    }
  }
</script>

<style scoped>
.border {
  border: 2px dashed orange;
}
</style>