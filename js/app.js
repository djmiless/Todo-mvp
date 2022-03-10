const app = (function(){
 

                // select the Elements
        
        const clear = document.querySelector(".clear");
        const dateElement = document.getElementById("date");
        const list = document.getElementById("list");
        const input = document.getElementById("input");
        const alarmBtn = document.querySelector(".set-alarm1");
        const enter = document.querySelector(".enterBtn");
        const container1 = document.querySelector(".container1");
        const closeAlarmBtn = document.querySelector(".close-btn");
        const item = document.querySelector(".item");

        let originalX;
        let originalY;

        // const setAlarm1 = document.querySelector(".set-alarm");
        // const clearAlarm1 = document.querySelector(".clear-alarm");
        // const setAlarmValue1 = document.querySelector(".alarmTime");


        // Classes Names

        const CHECK = "fa-check-circle";
        const UNCHECK = "fa-circle-thin";
        const LINE_THROUGH = "lineThrough";


        // variables 

        let LIST , id;

        // get item from localStorage
        let data = localStorage.getItem("TODO");

        // check if data is not empty

        if(data){
            LIST = JSON.parse(data);
            id = LIST.length; // set the id to the last one on the list
            loadList(LIST); // load the list to the user interface
        }else{
            // if data isn't empty
            LIST = [];
            id = 0;
        }

        // load items to the user's interface
        function loadList(array){
            array.forEach(function(item){
                addToDo(item.name, item.id, item.done, item.trash);
            }); 
        }

        // clear Local storage 

        clear.addEventListener("click", function(){
            localStorage.clear();
            location.reload();
        });


        // sh0w today's date

        const options = {weekday:"long", month:"short", day:"numeric"};
        const today = new Date();
        dateElement.innerHTML = today.toLocaleDateString("en-US", options);

        // add to do funtion

        function addToDo(toDo, id, done, trash){

            console.log("Id: ", id);

            if(trash){return;}

            const DONE = done ? CHECK : UNCHECK;
            const LINE = done ? LINE_THROUGH : "";

            const item =   `<li class="item" draggable="true" id="item_${id}" ondragstart='app.handleDragStartEvent(event, ${id})' ondragend='app.handleDragEndEvent(event, ${id})'>
                                <a href="#">
                                <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                                <p class="text ${LINE}">${toDo}</p>
                                <i class="fa fa-trash-o de" job="delete" id="${id}"></i> 
                            </a></li>`;
            const position = "beforeend";
            list.insertAdjacentHTML(position, item);

        }




        // add an item to the list user the enter key


        document.addEventListener("keyup" , function(even){

                if(event.keyCode == 13){
                    const toDo = input.value; 

                    // if the input isn't empty

                    if(toDo){
                        addToDo(toDo, id, false, false);
                        LIST.push({
                            name : toDo,
                            id : id,
                            done : false,
                            trash : false
                        });

                        // add item from localStorage  (this code must be added where the list array is updated)
                         localStorage.setItem("TODO", JSON.stringify(LIST));

                        id++;
                    }
                    input.value = "";
                }


        });


            // complete to do

        function completeToDo(element){
            element.classList.toggle(CHECK);
            element.classList.toggle(UNCHECK);
            element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

            LIST[element.id].done = LIST[element.id].done ? false : true;
        }



            // remove to do
        function removeToDo(element){
            element.parentNode.parentNode.removeChild(element.parentNode);
            LIST[element.id].trash = true;
        }


        // target thr items created dynamically


        list.addEventListener("click", function(event){
            const element = event.target; // return the clicked element inside the list
            const elementJob = element.attributes.job.value; // complete or delete


            if (elementJob == "complete"){
                completeToDo(element);
            }  else if (elementJob == "delete"){
                removeToDo(element);
            }

            // add item from localStorage  (this code must be added where the list array is updated)
            localStorage.setItem("TODO", JSON.stringify(LIST));
        });


            // add event listener the click button
     

            document.querySelector(".enterBtn").addEventListener("click", function(even){
                if(enter){
                    const toDo = input.value;

                    if(toDo){

                        addToDo(toDo, id, false, false);
                        // alert("was clicked")
                        
                        LIST.push({
                            name : toDo,
                            id : id,
                            done : false,
                            trash : false
                        });
                    
                        localStorage.setItem("TODO", JSON.stringify(LIST));
                       
                        id++;
                        
                    }
                    input.value = ""                     
                }

                
            });




            // alarm modal

         
            const display = document.getElementById('clock');
            const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
            audio.loop = true;
            let alarmTime = null;
            let alarmTimeout = null;
            
            function updateTime() {
                const date = new Date();
            
                const hour = formatTime(date.getHours());
                const minutes = formatTime(date.getMinutes());
                const seconds = formatTime(date.getSeconds());
            
            
            
                display.innerText=`${hour} : ${minutes} : ${seconds}`
            }
            
            function formatTime(time) {
                if ( time < 10 ) {
                    return '0' + time;
                }
                return time;
            }
            

            // save the date and time provided by the alarm

            document.querySelector(".alarmTime").addEventListener("change", function(){
               
                    function setAlarmTime(value) {
                        alarmTime = value;
                    }
                    setAlarmTime(this.value);                

            })

            // write a function for set alarm


            document.querySelector(".set-alarm").addEventListener("click", function(){

                function setAlarm() {
                    if(alarmTime) {
                        const current = new Date();
                        const timeToAlarm = new Date(alarmTime);
                
                        if (timeToAlarm > current) {
                            const timeout = timeToAlarm.getTime() - current.getTime();
                            alarmTimeout = setTimeout(() => audio.play(), timeout);
                            alert('Alarm set');
                        }
                    }
                }
                setAlarm()

                
            })



            // write a function to clear alarm


            document.querySelector(".clear-alarm").addEventListener("click", function(){


                function clearAlarm() {
                    audio.pause();
                    if (alarmTimeout) {
                        clearTimeout(alarmTimeout);
                        alert('Alarm cleared');
                    }
                }

                clearAlarm()
                
                setInterval(updateTime, 1000);
            })
            

            

            // on click of alarm button

            document.querySelector(".set-alarm1").addEventListener("click", function(event){
                if(alarmBtn){
                    // alert("works");
                    container1.style.display = "flex";
                      
                }
            })


            // on click of the close alarm button

            document.querySelector(".close-btn").addEventListener("click", function(){

                if(closeAlarmBtn){
                    container1.style.display = "none";
                }

            })



            return {
                handleDragStartEvent: function (event, id){

                    console.log(event);
                    console.log(id);
                 
                    originalX = event.pageX;
                    originalY = event.pageY;
            
        
                },

                handleDragEndEvent : function(event, id){
                    console.log("Drag ended");
                    let listContent = event.target.innerText;
                    //console.log("Drag over: ", event);
            
                    let dragX = event.pageX;
                    let dragY = event.pageY;
            
                    console.log("X: ", dragX);
                    console.log("Y: ", dragY);
            
            
                    if(dragX > originalX){
                        //drag was made to the right..
                        //save the list..
                        console.log("Save this list item");
                        confirm(`Are you sure you want to save this item: ${listContent}?`)
                    }
            
                    if(dragX < originalX){
                        // drag was made to the left
                        //delete the list item
                        
                        console.log("Delete this list item");
                        confirm(`Are you sure you want to delete this item: ${listContent}?`)
                     
                        
                         let del = document.querySelector(`#item_${id}`).remove();
                        

                         let toDo = localStorage.getItem("TODO");

                         toDo = JSON.parse(toDo);

                         for(let i = 0; i < toDo.length; i++){
                             if(toDo[i].id == id){
                                 toDo.splice(i, 1);

                                 toDo = JSON.stringify(toDo);

                                 localStorage.setItem("TODO", toDo);
                                 location.reload();
                             }
                         }
                      


                        

                                        
                        


                        
                        
                        

                        

                                         
                        

                        
                    }

                    

                }

                

            }


        
}())