/* Here comes the code for the functioning (partially interactive - at least in the 
ultimate form) calendar. This calendar should be visible for everyone without the
need to log in, BUT only logged-in individuals should be able to introduce some changes to it.*/

/*https://github.com/janson-git/event-calendar -- some inspiration for this part of the BGM.*/

/*Roughly speaking, in back-end, an array of events will be stored (e.g.: id, title, description, 
date, location, authorship, and whether it's public or not), and the front-end will take the stored events, 
and put them in a calendar (could be a widget).*/