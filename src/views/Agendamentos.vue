<template>
  <layout>    
    <v-container>


          <v-combobox
            v-model="status_ids"
            :items="status"
            item-text="name"
            item-value="id"
            label="Status"
            multiple
            outlined
            dense
          ></v-combobox>

          <v-virtual-scroll
            :items="schedules"
            :item-height="200"
            min-height="500"
            max-height="500"
          >
            <template v-slot:default="{ index, item }">
              <v-card
                class="mx-auto my-2"
                outlined
                :key="item.id"
                v-on:click="toSchedule(item)"
              >
                <v-list-item three-line >
                  <v-list-item-content>
                    <div class="overline mb-4">
                     {{item.service.name}}
                    </div>
                    <v-list-item-title class="headline mb-1">
                      {{item.pet.name}}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{item.date}} - {{item.time}}
                    </v-list-item-subtitle>
                    
                  </v-list-item-content>
                  

                  <v-list-item-avatar
                    size="80"
                    color="grey"
                  >
                   <img
                    :src="`http://localhost/${item.service.image}`"
                    alt=""
                  >
                  </v-list-item-avatar>
                  
                  
                </v-list-item>
                <v-divider></v-divider>
                
                <v-card-actions class="py-4">
                  
                  <v-row
                    justify="space-around"
                    align="center"
                    
                  >
                    <v-chip
                      class="ma-2"
                      color="primary"
                      width="100%" 
                    >
                      Agendado
                    </v-chip>

                    
                  </v-row>
                </v-card-actions>
              </v-card>
            </template>
          </v-virtual-scroll>


    </v-container>
  </layout>
</template>

<script>
import axios from 'axios';
import layout from './Layout';
  export default {
  methods: {
    toSchedule(schedule){
      this.$router.push({name: 'AgendamentoDetalhes', params: {id: schedule.id}});
    }
  },
    created () {
      const token = localStorage.getItem('token');

      axios.get('http://localhost/api/service-schedule/client', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).then(data => {
        this.schedules = data.data;
        
      }).catch(err => {
        console.log(err);
      })
    },
    data: () => ({
      status_ids: [],
      status: [
        {id: 1, name: 'Agendado'},
        {id: 2, name: 'Serviço Iniciado'},
        {id: 3, name: 'Serviço Concluído'}
      ],
      schedules: []

    }),
    components: {
      layout
    }
    
  }
</script>