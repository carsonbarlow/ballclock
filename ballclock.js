
var ballclock = angular.module('ballclockApp', []);

ballclock.controller("bcController", function($scope){

  $scope.days_until_original_order = function(){};

  $scope.current_state = function(){};

  $scope.do_work = function(s, ball_count, minute_count){
    if (!ball_count || ball_count < 27){return;}
    var c = new Clock(ball_count);
    
    s.queue_after_12_hours = '[' + c.do_12_hours().join(',') + ']';
    console.log(c);
  };
});

var Clock = function(balls){;
  var queue = [],
    minute = [],
    five_minute = [],
    hour = [];
  for (var i = 0; i < balls; i++){
    queue.push(i+1);
  }

  this.do_12_hours = function(){
    for (;;){
      minute.push(queue.shift());
      if (minute.length > 4){
        five_minute.push(minute.pop());
        for(;minute.length;){
          queue.push(minute.pop());
        }
        if (five_minute.length > 11){
          hour.push(five_minute.pop());
          for(;five_minute.length;){
            queue.push(five_minute.pop());
          }
          if (hour.length > 11){
            var limbo = hour.pop();
            for(;hour.length;){
              queue.push(hour.pop());
            }
            queue.push(limbo);
            return queue;
          }
        }
      }
    }
  };

  this.queue = queue;
  this.minute = minute;
  this.five_minute = five_minute;
  this.hour = hour;
};



