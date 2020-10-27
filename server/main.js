import { Meteor } from 'meteor/meteor';
import { Tasks } from "/lib/collection.js";
import { Todo } from "/lib/collection.js";
import { Network } from "/lib/collection.js";
Meteor.startup(function()
{
}
);
Meteor.methods({
     addtask : function(task,todo_id,user_id)
     {    
     	 Tasks.insert({
            task: task,
            createdAt: new Date(),
            createdBy:user_id,
            createdOn:todo_id
        });
     },
     removetask : function(task_id)
     { 
       Tasks.remove(task_id);
     },
     addtodo :function(title,description,due_time,due_date)
     {
     	Todo.insert({
     		 title:title,
          description:description,
          Date:new Date(),
          due_date:due_date,
          due_time:due_time,
     		 todoBy:Meteor.user()._id
     		});
     }
     ,
     removetodo: function(todo_id)
     {
     	  Todo.remove(todo_id);
        Network.remove({todo_id:todo_id});
        Tasks.remove({createdOn:todo_id});
     },
     addnetwork : function(todo_id,curr_id,network_id)
     {
          	Network.insert({
            todo_id:todo_id,
            createdOn: new Date(),
            curr_id:curr_id,
            network_id:network_id,
            approved:false

      });
     },
     removetodo_fromnetwork :function(network_id)
     {
     	Network.remove({_id:network_id});
     },
     updateapproval :function(network_id)
     {
        Network.update({_id:network_id},{$set:{'approved':true}});
     }
     ,updatetitle:function(todo_id,title)
     {
        Todo.update({_id:todo_id},{$set:{'title':title}});
     },
     updatediscription:function(todo_id,description){
      Todo.update({_id:todo_id},{$set:{'description':description}});
     },
     updateduedate:function(todo_id,due_date)
     {
      Todo.update({_id:todo_id},{$set:{'due_date':due_date}});
     },
     updateduetime:function(todo_id,due_time){
      Todo.update({_id:todo_id},{$set:{'due_time':due_time}});
     }

});
// methods are used to secure the site 


