# Gig Drivers Ratings

> Given that we have noticed risk increase below a rating threshold in gig platforms.
>
> When an Driver connects a Gig Account.
>
> Then we should have a rule that evaluates the number.

- We have a list of Drivers
- We have a list of Driver's Gig Accounts
- We have a list of Gig Account's Ratings
  - Rating is feedback that a Driver gets from the passenger in a specific ride

**A driver will be "rejected" if his AVERAGE rating is below 3 (< 3)**

**A driver will be "accepted" if his AVERAGE rating is at least 3 (>= 3)**

## Task

- Create an endpoint `/drivers/status` (driver.controller.ts).
- The endpoint should call a service method that will have the business logic (driver.service.ts).

Required output:

```[
  {
    driver: {
      id: "driver-1",
      name: "Driver 1",
      email: "driver_1@email"
    },
    avg_rating: 3,
    status: "accepted"
  },
  {
    driver: {
      id: "driver-2",
      name: "Driver 2",
      email: "driver_2@email"
    },
    avg_rating: 2,
    status: "rejected"
  }
]
```
