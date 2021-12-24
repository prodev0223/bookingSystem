

# Implement

## Closed Day list 

Get data from  `GetMarkedAsClosedCommand.cs`

Make a page same as `https://localhost:5001/GlobalList/MyBookings` at `https://localhost:5001/GlobalList/ClosedDay` 


## View all booking list 
- Create a file same as `GetMarkedAsClosedCommand.cs`
- Get data from the new file -> put the function in `BookingController.cs`

- make a list also same as `https://localhost:5001/GlobalList/MyBookings` at `https://localhost:5001/GlobalList/ViewAllBookings`


## try to show bookings on 
`https://fullcalendar.io/docs/list-view-demo`
type of list



## New user form
Url: `https://localhost:5001/AllSimpleUserInfoList`

Add a new button above user list
same as 'new' button on https://localhost:5001/GlobalList/MyBookings

on click the pop up a winbox same as other forms

with a form similar to `update user's group`
but add a field `username`

may call the api at `CreateUser.cs`



## Room settings form
there's start, end time field
update at to 7 day \[start/end\] time

from 

 |  |  | 
| ---- | ----- |
| start | 09:00 |
| end | 09:00 | 

to something like 

 |  |  |   |
| ---- | ----- | - |
| Monday | 09:00 | 19:00 |
| Tueday | 09:00 | 19:00 |
| Wednesday | 09:00 | 19:00 |
| Thursday | 09:00 | 19:00 |
| Friday | 09:00 | 19:00 |
| Saturday | 09:00 | 19:00 |
| Sunday | 09:00 | 19:00 |


## For all the forms
if the api return 400 error make at show on the ui, 
show error on the respective fields