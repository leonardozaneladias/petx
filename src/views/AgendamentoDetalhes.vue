<template>
  <layout>    
    
    <v-container :fluid="true">

        <!-- <v-card class="justify-center" v-if="schedule.service">
          <v-img height="150px" :src="`http://localhost/${schedule.service.image}`"></v-img> 
          <v-card-title>{{schedule.service.name}} </v-card-title>
        </v-card>  -->


          <v-card
            :loading="loading"
            class="mx-auto my-0"
            max-width="374"
          >
            <template slot="progress">
              <v-progress-linear
                color="deep-purple"
                height="10"
                indeterminate
              ></v-progress-linear>
            </template>

            <v-img
              height="100"
              :src="`http://localhost/${schedule.service.banner}`"
            ></v-img>
 

            <v-card-text>

              <div class="title">
                {{schedule.service.name}}
              </div>

              <div>
                {{schedule.service.description}}
              </div>

              <div>
                
                <v-list dense>
                  <v-list-item v-for="it in addServs" :key="it">
                    <v-list-item-content>
                      + {{it}}
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>

              <v-divider class="my-3"></v-divider>

              <v-avatar
                color="primary"
                size="56"
                class="mr-5"
              >
                <v-img :src="`http://localhost/${schedule.service.image}`"></v-img>
                </v-avatar>

                {{schedule.pet.name}}

            </v-card-text>

            <v-divider class="mx-4"></v-divider>

            <v-card-title>Data e Hora agendada</v-card-title>

            <v-card-text>
          
                <v-chip>{{dateTimeFormated}}</v-chip>

            </v-card-text>

            
          </v-card>


       <v-divider class="mt-2 mb-2"></v-divider>

        <v-card>
          <v-card-text>
            <v-timeline
              align-top
              dense
            >
              <v-timeline-item
                v-for="message in messages"
                :key="message.time"
                :color="message.color"
                small
              >
                <div>
                  <div class="font-weight-normal">
                    <strong>{{ message.from }}</strong> @{{ message.time }}
                  </div>
                  <div>{{ message.message }}</div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>

        </v-card>
        

    </v-container>
  </layout>
</template>

<script>
import axios from 'axios';
import layout from './Layout';
import moment from 'moment';

  export default {
    
    props: ['id'],
    computed: {
      addServs(){
        return this.schedule.additional_services.map((arr) => {return arr.additional_service.name});
      },
      dateTimeFormated(){
        return moment(this.schedule.date + 'T' + this.schedule.time).format('DD/MM/YYYY H:m');
      }

    },
    created(){
      
      const token = localStorage.getItem('token');
        
      axios.get('http://localhost/api/service-schedule/' + this.id, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).then(data => {
        this.schedule = data.data;
      }).catch(err => {
        console.log(err);
      })
    },
    beforeMount(){
      window.scrollTo(0, 0);
      
      const token = localStorage.getItem('token');
        
      axios.get('http://localhost/api/service-schedule/' + this.id, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).then(data => {
        this.schedule = data.data;
      }).catch(err => {
        console.log(err);
      })
    },
    
    mounted(){
      // this.timesUpdate();
    },
    watch: {
      
    },
    data: () => ({
      schedule: {},
      messages: [
        {
          from: 'Você',
          message: `Realizou o agendamento`,
          time: '10:42',
          color: 'deep-purple lighten-1',
        },
        {
          from: 'Tosador 1',
          message: 'Iniciou o Banho',
          time: '13:30',
          color: 'green',
        },
        {
          from: 'Tosador 1',
          message: 'Terminou o banho',
          time: '13:57',
          color: 'deep-purple lighten-1',
        },
      ],
    }),

    components: {
      layout
    },
    methods: {

    }
  }
</script>

<style scoped>
.border {
  border: 2px dashed orange;
}
</style>