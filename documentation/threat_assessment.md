#Threat and Risk Assessment
This assessment is current as of June 3rd, 2025.

## Overview
When using *FoodBank Connect*, people should be aware of the cybersecurity risks inherent in the system.
Here, we outline actors who have motive to attack the system, the risks such actors pose, and how different
attacks can be launched from different entry points to the system.

## Risks
We now explore the risks to cybersecurity.  
We frame risks as the Cartesian Product between 
reasons an attacker might want to attack *FoodBank Connect*: espionage, sabotage, exploitation, or misuse; 
and the means we expect the actor to possess: civilian, corporate, government, or internal (to an implementing
foodbank).

### Risks to Confidentiality
Foodbanks serve vulnerable populations.  There are individuals, corporate leaders, and government actors 
that seek to identify and harm specific marginalized groups. 

We should therefore expect civilian, corporate, and
government espionage to threaten the confidentiality of our users. As such attackers could infiltrate
a foodbank using *FoodBank Connect*, we should also expect internal espionage to be possible.

### Risks to Integrity
There are individuals that may seek to use *FoodBank Connect* to present introduce faulty entries for the
purpose of obtaining extra food from the foodbank.  We rely on volunteers for authentication of guest supplied data.

We should therefore expect civilian exploitation and internal misuse to threaten the integrity of our system.

### Risks to Availability
Our system is especially vulnerable to availability issues. When users submit faulty entries, they significantly increase 
the amount of volunteer time and effort needed to serve guests.

Some corporations have an interest in limiting the availability of foodbank services because the foodbank services reduce
their customer base.

We should therefore expect customer misuse and corporate sabotage to threaten the availability of our system.

## Threats
We now examine the specific attacks we are knowledgeable about. 
### Threats to Confidentiality
#### Attack: Infiltration for the purpose of espionage.
An attacker can volunteer at the foodbank. If given access to FoodBank connect, the attacker can easily obtain sensitive
data of guests.

The likelihood of an attacker succeeding using this strategy is moderate and the impact is high because infiltration 
is costly for the attacker and subjects the attacker to the scrutiny of overseeing volunteers.

To mitigate this kind of attack, there is no substitute for the careful oversight of volunteers.

#### Attack: Government forcibly obtains global access to *Google Forms*.
An attacker with government resources could encourage, legally force, or threaten *Google* into surrendering complete
access to *Google Forms*.  Sensitive data of potentially vulnerable people would then be exposed to the government.

There is no defense against this attack possible without removing the dependency on *Google*'s API from the project.

The likelihood of an attacker succeeding using this strategy is high and the impact is high because
threats from government are credible and sensitive people could be hurt using the leaked data.

To mitigate this kind of attack, we advise those who are vulnerable to government actors to not use the system.  

### Threats to Integrity

#### Attack: Insertion of incorrect, deceptive, or otherwise malicious guest data.
FoodBank Connect offers its guest users freedom in how forms are filled out because such users include members
of vulnerable populations. Further, the only authentication for the data guests provide on the form is volunteer action. 

Thus, any user can easily insert unacceptable, invalid, or deceptive entries.

When such entries make it to the FBM database, this can result in volunteers incorrectly allocating resources or
consuming a volunteer's time.

The likelihood of an attacker succeeding using this strategy is extreme and the impact is low because volunteers
are involved heavily in the process of verifying a guest's data as the guests are served.

To mitigate this threat, we flag suspicious entries and rely on volunteers to resolve incorrectness as need be.

#### Attack: Mislead volunteers to deleting correct data or insert incorrect data.
If volunteers are mislead intentionally or otherwise, they can delete correct data from FBM or delete a flagged entry that contains mostly correct information.  By presenting their problem in an obtuse fashion, guests can confuse volunteers and lead them to act
in ways that compramise the data of guests.

The likelihood of an attacker succeeding using this strategy is moderate and the impact is moderate because 
people can be deceived and volunteers are busy people.

To mitigate this threat, the system and what it requires of volunteers must be clearly communicated.

### Threats to Availability
#### Attack: Users submit faulty forms abundantly.
Here is how the attacker can repeatedly submit forms:
1. Create a new Google account.
2. Fill out an intake form.
3. Repeat.

To limit the capacity of our system, users can submit an abundance of duplicate or invalid entries. Here is the life cycle of an
invalid entry:
1. Attacker submits incorrect form.
2. Form lives in our servers and shows up as flagged for volunteers.
3. A guest arrives at the FoodBank after filling out a form whose data cannot be located.
4. A volunteer searches through the flagged entries to find the incorrectly filled out form.
5. The volunteer updates the information to make it correct.
By submitting flagged entries en masse, attackers can either make finding the correct flagged entry prohibitively expensive or utilize too much of volunteer's time in deleting incorrect entries.  
Worse, this attack, if done carefully, could encourage volunteers to delete correct forms which would increase the intake time.

The likelihood of an attacker succeeding using this strategy is high and the impact is high because all flagged entries are visible
to volunteers and volunteers will find it challenging to comb through a vast number of flagged entries.

To mitigate this threat, we recommend that volunteers be ready to abandon the system if denial of service issues arise.

## Conclusion
In conclusion, users of the system, guests and volunteers, must be extraordinarily careful when interacting with this system in its
current state. Potential users should see this project in its current form as a proof of concept without sufficiently rigorous and robust security measures.
