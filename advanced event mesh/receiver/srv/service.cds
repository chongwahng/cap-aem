namespace gcoe;

using gcoe as my from '../db/schema';

service ReceiverService {
    entity Toys    as projection on my.Toys {
        ID,
        Name,
        Owner
    };

    entity Changes as projection on my.Changes {
        Toy.Name,
        Timestamp,
        Data
    };
};
