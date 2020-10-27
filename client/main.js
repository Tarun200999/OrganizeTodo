import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tasks } from "/lib/collection.js";
import { Todo } from "/lib/collection.js";
import { Network } from "/lib/collection.js";
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import './main.html';
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap";
window.Tasks = Tasks
window.Todo=Todo
window.Network=Network
Router.configure({
	layoutTemplate: 'ApplicationLayout'
});
Router.route('/', function () {
	if(!Meteor.user())
	  {	
        this.render('navbar',{
  	      to:"1"
		});
		this.render('empty',{
		  to:"2"
		});
		this.render('homepage',{
			to:"3"
		});
		this.render('empty',{
            to:"4"
		});
      }
    else
    {
    
     this.render('navbar',{
    	to:"1"
      });
      this.render('add_todo_form',{
  	   to:"2"
	  });
	  this.render('showtodo',{
	   to:"3"
	  });
	  this.render("empty",{
       to:"4"
	  });	
    }
  });
Router.route('/showtodo', function () 
{
	if(!Meteor.user())
	  {	
        this.render('navbar',{
  	      to:"1"
		});
		this.render('empty',{
		  to:"2"
		});
		this.render('homepage',{
			to:"3"
		});
		this.render('empty',{
            to:"4"
		});
      }
	else{
	this.render('navbar',{
     	to:"1"
     });
	 this.render('add_todo_form',{
  	   to:"2"
     });
     	this.render('showtodo',{
  	   to:"3"
	 });
	 this.render('empty',{
		 to:"4"
	 })
	}
});
Router.route('/todorequests', function () 
{
	if(!Meteor.user())
	  {	
        this.render('navbar',{
  	      to:"1"
		});
		this.render('empty',{
		  to:"2"
		});
		this.render('homepage',{
			to:"3"
		});
		this.render('empty',{
            to:"4"
		});
      }
	else{
	this.render('navbar',{
     	to:"1"
     });
	 this.render('empty',{
  	   to:"2"
     });
     	this.render('networkrequest',{
  	   to:"3"
	 });
	 this.render('empty',{
		 to:"4"
	 })
	}
});
Router.route('/showtodo/addtask/:_id', function () 
{
	  this.render('navbar',{
  	   to:"1"
         });
     
     	this.render('add_todo_form',{
  	   to:"2"
         });
     	this.render('showtodo',{
  	   to:"3"
         });
});  
Router.route('/showtodo/networks/addtask/:_id', function () 
{
	  this.render('navbar',{
  	   to:"1"
         });
     
     	this.render('empty',{
  	   to:"2"
         });
     	this.render('network_collections',{
  	   to:"3"
		 });
		 this.render('empty',{
			 to:"4"
		 });
});    
Router.route('/showtodo/networks', function () 
{    
	if(!Meteor.user())
	  {	
        this.render('navbar',{
  	      to:"1"
		});
		this.render('empty',{
		  to:"2"
		});
		this.render('homepage',{
			to:"3"
		});
		this.render('empty',{
            to:"4"
		});
      }
	else{
	this.render('navbar',{
     	to:"1"
     });
	 this.render('empty',{
  	   to:"2"
     });
     	this.render('network_collections',{
  	   to:"3"
	 });
	 this.render('empty',{
		 to:"4"
	 })
	}
	
});    
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});
//this is used to configer the user login form
Template.navbar.helpers({
   counttodo:function(){
         return Todo.find({todoBy:Meteor.user()._id}).count();
   },
   countsharedtodo:function(){
        return Network.find({network_id:Meteor.user()._id,approved:true}).count();
   },
   countrequest:function(){
        return Network.find({network_id:Meteor.user()._id,approved:false}).count();
   }
});
Template.showtodo.helpers({
	todo: function () {

		return Todo.find({todoBy:Meteor.user()._id},{sort:{due_date:1}});
	
	},
	item: function () {

		return Tasks.find({createdOn:Session.get("currtodoid")},{sort:{createdAt:-1}});
	
	},
	 networksname : function()
	 {  

	 	return Network.find({todo_id:Session.get("todoidofperson")});
	 },
	 getnetwork_useranme :function(user_id)
	 {
	 	return Meteor.users.findOne({_id:user_id}).username;
	 },
	 checkTheuser_showtodo:function(user_id)
	 {  
	 	if(user_id==Meteor.user()._id)
	 		return "you";
	 	else
	 	{
	 		return Meteor.users.findOne({_id:user_id}).username;
	 	}
	 	
	 },
     checktodos:function()
     {
     	if(Tasks.find({createdOn:Session.get("currtodoid")}).count()==0)
     		return "Nothing to show Add New Task";
     	else
     		return;

     }

	
});


Template.networkrequest.helpers({

	countrequest:function(){
		 if(Network.find({network_id:Meteor.user()._id,approved:false}).count()==0)
		      return "No New Request";
	},
	networkunchecked:function()
	 {   
		 return Network.find({network_id:Meteor.user()._id,approved:false});
	 },
	 getusername:function(user_id)
	 {   
		 return Meteor.users.findOne({_id:user_id}).username;
	 },
	 gettitle:function(todo_id)
	 {   
		 return Todo.findOne({_id:todo_id}).title;
	 }
});
Template.networkrequest.events({
	'click .js_button_network_approval':function()
	{
		Meteor.call("updateapproval",this._id);
		return false;             
	},
	'click .js_button_network_reject':function()
	{
		Meteor.call("removetodo_fromnetwork",this._id);
		return false;
	}
});
Template.network_collections.helpers({
	network: function(){
       return Network.find({network_id:Meteor.user()._id,approved:true});
	},
	getTodo: function(todo_id,user_id)
	{
       Session.set("network_todo",todo_id);
	},
	todo:function()
	{   
		return Todo.find({_id:Session.get("network_todo")});
	},
	getdescription:function(todo_id)
	{
		return Todo.findOne({_id:todo_id}).description;
	},
	getadddate:function(todo_id)
	{
       return Todo.findOne({_id:todo_id}).Date;
	},
	getduedate:function(todo_id)
	{   
		return Todo.findOne({_id:todo_id}).due_date;
		
	},
	getduetime:function(todo_id){
        return Todo.findOne({_id:todo_id}).due_time;
	},
	item : function()
	{   
		return Tasks.find({createdOn:Session.get("currtodoid_network")},{sort:{createdAt:-1}});

	},
	getusername:function(user_id)
	{   
		return Meteor.users.findOne({_id:user_id}).username;
	},
	gettitle:function(todo_id)
	{   
		return Todo.findOne({_id:todo_id}).title;
	},
	checkTheuser:function(user_id)
	{
		if(user_id==Meteor.user()._id)
			return "You";
		else
			return Meteor.users.findOne({_id:user_id}).username;
	}
});
Template.network_collections.events({
	'click .js_addtask_button_network':function(event)
	  {  
	  	 Session.set("currtodoid_network",Network.findOne({_id:this._id}).todo_id);
	  	 Session.set("currid_network",Network.findOne({_id:this._id}).curr_id);
         $("#modal_add_task_network").modal('show');
        },
        'click .remove_todo_from_network':function(){
			Meteor.call("removetodo_fromnetwork",this._id);
			
		    return false;
		 },
		 'submit .js_remove-task_from_todo':function(event){
			Meteor.call("removetask",this._id);
			return false;
		 },
	     'submit .add_task_network': function(event)
	       {   if(Meteor.user())
		     {    var curr=Session.get("currtodoid_network");
			      var task=event.target.task_title.value;
			      var user_id=Meteor.user()._id;
                 if(task.length==0)
        	       alert("Enter Task");
                 else
                 { 
        	       Meteor.call("addtask",task,curr,user_id);
                   event.target.task_title.value="";
                 }
		      }
				else
				{
					alert("Login / SignUp to insert Task");
				}
			
        return false;
	}
});

// it is used to send the data to the items template

Template.showtodo.events({
	'click .remove':function(){
			Meteor.call("removetodo",this._id);
		    return false;
	},
	'click .js_addtask_button':function(event){
		Session.set("currtodoid",this._id);
      $("#modal_add_task").modal('show');
        }
    ,
    'submit .js_remove-task_from_todo':function(event)
    {  
		Meteor.call("removetask",this._id);
       return false;
    },
    'click .js_showtodo_network_delete':function(event)
    {  
       Meteor.call("removetodo_fromnetwork",this._id);
       return false;
    },
    'click .js_addnetwork_button':function(event){
		Session.set("todoidofperson",this._id);
         $("#modal_add_network").modal('show');
    }
     ,
	'click .js_edittask_button':function(event){
		Session.set("todo_id",this._id);
        $("#modal_edit_todo").modal('show');
	 },
	 'submit .edit_todo':function(event){
		var title=event.target.todo_title.value;
		var description=event.target.todo_description.value;
		var due_date=new Date(event.target.todo_duedate.value);
		var due_time=event.target.todo_duetime.value;
		var todo_id=Session.get("todo_id");
		if(title!="")
		{   
			Meteor.call("updatetitle",todo_id,title);
		}
		if(description!="")
		{

			Meteor.call("updatediscription",todo_id,description);
		}
		if(due_date!="Invalid Date")
		{
			Meteor.call("updateduedate",todo_id,due_date);
		}
		if(due_time!="")
		{
			Meteor.call("updateduetime",todo_id,due_time);
		}

		event.target.todo_title.value="";
		event.target.todo_description.value="";
		event.target.todo_duedate.value="";
		event.target.todo_duetime.value="";
		$("#modal_edit_todo").modal('hide');
		return false;  



	 },
    'submit .add-task': function(event)
	{   if(Meteor.user())
		{   var curr=Session.get("currtodoid");
			var task=event.target.task_title.value;
			var user_id=Meteor.user()._id;
            if(task.length==0)
        	alert("Enter Task");
            else
            { 
        	  Meteor.call("addtask",task,curr,user_id);
              event.target.task_title.value="";
            }
		}
		else
		{
			alert("Login / SignUp to insert Task");
		}
       
        return false;
	},
	'submit .add_network': function(event)
	{   if(Meteor.user())
		{   var todo_id=Session.get("todoidofperson");
			var user_name=event.target.network_user_name.value;
            if(user_name.length==0)
            {
        	   alert("Enter UserName");
            }
            else
            { 
        	  if(!Meteor.users.findOne({username:user_name}))
        	    {
        	  	  alert("User Not Found");
        	    }
        	  	else
        	  	{
        	  	  var user_id_found=Meteor.users.findOne({username:user_name})._id;
        	  	   if(Network.findOne({todo_id:todo_id,network_id:user_id_found}))
        	  	       alert("Username Already Added");
        	  	   else
        	  	   {  if(user_id_found==Meteor.user()._id)
        	  	   	    alert("You can'nt Add Yourself");
        	  	   	  else
        	  	   	  {  
        	  	 	  Meteor.call('addnetwork',todo_id,Meteor.user()._id,user_id_found);
                      
                      }
        	  	   }   	
        	    }
                
            }
		}
		else
		{
			alert("Login/SignUp to insert a Task");
		}
       event.target.network_user_name.value="";
        return false;
	}


});

Template.add_todo_form.events({
    
	'submit .js_addtodo_button':function(event){
      $("#modal_add_todo").modal('show');
        return false;
        },
	

   'submit .save_todo':function(event){ 
      if(Meteor.user())
		{   
			var title=event.target.todo_title.value;
			var description=event.target.todo_description.value;
			var due_date=new Date(event.target.todo_duedate.value);
			var due_time=event.target.todo_duetime.value;
			if(due_date=="Invalid Date")
			{	due_date=new Date(); 
				if(title.length==0)
			 	alert("Enter Title");
			    else
			    {
			    
			     Meteor.call("addtodo",title,description,due_time,due_date);
			     event.target.todo_title.value="";
			     event.target.todo_description.value="";
			     event.target.todo_duedate.value="";
			     event.target.todo_duetime.value="";
			    }
			}	    
			else
			{
				if(title.length==0)
				alert("Enter Title");
			    else
			    { 
			    Meteor.call("addtodo",title,description,due_time,due_date);
			    event.target.todo_title.value="";
			    event.target.todo_description.value="";
			    event.target.todo_duedate.value="";
			    event.target.todo_duetime.value="";
			    }
				  
			}   

              
		  
		}    
		else
		{
			alert("Login/SignUp to insert a Task");
		}
        $("#modal_add_todo").modal('hide');
       
        return false;
    }
});

