export const diagrams = {
  governance: `flowchart TD
    MOJ["Ministry of Justice<br/>and Public Security"]
    MOC["Ministry of Culture<br/>(legacy role)"]
    DNRCI["DNRCI<br/>National Directorate"]
    ANH["Archives Nationales<br/>d'Haïti (ANH)"]
    ONI["ONI<br/>(National ID)"]
    DIE["DIE<br/>(Passports)"]
    XROAD["X Road<br/>exchange layer"]

    subgraph DEPTS["10 Departmental Civil Offices"]
      D1["Ouest"]
      D2["Nord"]
      D3["... (8 more)"]
    end

    subgraph POR["Points of Registration"]
      HOSP["Hospitals<br/>(DNRCI-dedicated staff)"]
      MOB["Mobile Units<br/>(rural areas)"]
    end

    ANH_NOTE["During the transition period, ANH retains physical custody of original paper records while DNRCI builds the live database from digitized copies."]
    DEPTS_NOTE["Each departmental office shares a building with ONI and other public services (one-stop-shop model)."]

    MOJ -->|oversees| DNRCI
    MOC -->|oversees| ANH
    DNRCI -->|supervises| DEPTS
    DEPTS -->|coordinates| POR
    ANH -.->|transitional custody of historical archives| DNRCI
    DNRCI --> XROAD
    XROAD --> ONI
    XROAD --> DIE
    ANH -.-> ANH_NOTE
    DEPTS -.-> DEPTS_NOTE

    class ANH_NOTE,DEPTS_NOTE note`,

  workflow: `stateDiagram-v2
    state "Notified" as Notified
    state "Declared" as Declared
    state "Validated" as Validated
    state "Registered" as Registered
    state "Escalated" as Escalated
    state "Rejected" as Rejected

    [*] --> Notified: Hospital staff / mobile unit submits basic data
    Notified --> Declared: DNRCI trained officer adds supporting documents
    Declared --> Validated: Automatic system check (duplicates, consistency)
    Validated --> Registered: Departmental Civil Officer approves, generates NICU, and signs digitally
    Validated --> Escalated: Anomaly detected (possible duplicate/fraud)
    Escalated --> Registered: Central HQ resolves case
    Escalated --> Rejected: Fraud confirmed
    Registered --> [*]
    Rejected --> [*]
    note left of Registered
      Legal record. Available for query by ONI and DIE via the national database.
    end note`,

  architecture: `flowchart TD
    Landing["Landing Station<br/>ISP Backbone"]
    Perimeter["Primary Data Center<br/>Network Perimeter<br/>Firewall, router, WAF"]
    RegistrationChannels["Registration channels<br/>Hospitals, civil offices, mobile units"]
    IdentityPartners["Identity partners<br/>ONI and DIE"]
    Registration["Registration Gateway"]
    Exchange["Interoperability Gateway"]
    Registry["Civil Registry<br/>Core Services"]
    Database[("National Civil Registry Database<br/>One record per person")]
    Backup[("Backup Data Center<br/>Replica database")]

    Landing --> Perimeter
    Perimeter --> Registration
    Perimeter --> Exchange
    RegistrationChannels --> Registration
    IdentityPartners --> Exchange
    Registration --> Registry
    Exchange --> Registry
    Registry --> Database
    Database -->|Active passive replication| Backup`
};
