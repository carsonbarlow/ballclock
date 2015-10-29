
var ballclock = angular.module('ballclockApp', []);

ballclock.controller("bcController", function($scope){

  $scope.do_work = function(s, ball_count, minute_count){
    if (!ball_count || ball_count < 27){return;}

    var num_half_days = 1;
    var c = new Clock(ball_count);

    s.queue_after_12_hours = '[' + c.do_upto_12_hours().join(',') + ']';
    c.prep_easy_street();
    for(;;){
      c.do_easy_12_hours();
      num_half_days+=1;
      if (c.check_original_order()){break;}
    }
    s.days_until_original_order = (num_half_days/2);
    if (minute_count){
      var num_12_hours = parseInt(minute_count/720);
      var left_over_minutes = minute_count%720;
      for (var i = 0; i < num_12_hours; i++){
        c.do_easy_12_hours();
      }
      c.do_upto_12_hours(left_over_minutes);
      s.current_minute = '[' + c.minute.join(',') + ']';
      s.current_five_minute = '[' + c.five_minute.join(',') + ']';
      s.current_hour = '[' + c.hour.join(',') + ']';
      s.current_queue = '[' + c.queue.join(',') + ']';
    }else{
      s.current_minute = "";
      s.current_five_minute = "";
      s.current_hour = "";
      s.current_queue = "";
    }
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

  this.do_upto_12_hours = function(minutes){
    if (typeof minutes == 'undefined'){
      minutes = Infinity;
    }

    for (var i = 0;i < minutes; i++){
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
    this.queue = queue;
  };

  this.prep_easy_street = function(){
    this._12_hour_difference = [];
    for (var i = 0; i < queue.length; i++){
      this._12_hour_difference.push(queue[i] - (i+1));
    }
  };

  this.do_easy_12_hours = function(){
    var new_queue = [];
    for (var i = 0; i < queue.length; i++){
      new_queue.push(queue[i+this._12_hour_difference[i]]);
    }
    queue = new_queue;
    this.queue = queue;
  };

  this.check_original_order = function(){
    for (var i = 0; i < queue.length; i++){
      if (queue[i] != i+1){return false;}
    }
    this.queue = queue;
    return true;
  };

  this.minute = minute;
  this.five_minute = five_minute;
  this.hour = hour;
  this.queue = queue;

};



