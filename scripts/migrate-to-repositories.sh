#!/bin/bash

# Update JWT Strategy
sed -i 's/import { DatabaseService } from .\/..\/services\/database.service./import { UserRepository } from "@\/database";/' src/modules/auth/strategies/jwt.strategy.ts

# Update Doctor Profile Module
sed -i 's/import { DatabaseService } from .\/..\/auth\/services\/database.service./import { DoctorProfileRepository } from "@\/database";/' src/modules/doctor-profile/doctor-profile.module.ts

# Update EMR Services
for file in src/modules/emr/services/*.service.ts; do
  sed -i 's/import { DatabaseService } from .\/..\/..\/auth\/services\/database.service./import { EMRRepository } from "@\/database";/' "$file"
done

# Update Notification Services
sed -i 's/import { DatabaseService } from .\/..\/auth\/services\/database.service./import { NotificationRepository } from "@\/database";/' src/modules/notifications/notifications.module.ts
sed -i 's/import { DatabaseService } from .\/..\/..\/auth\/services\/database.service./import { NotificationRepository } from "@\/database";/' src/modules/notifications/services/notification.service.ts

# Update Patient Booking Services
sed -i 's/import { DatabaseService } from .\/..\/..\/auth\/services\/database.service./import { BookingRepository } from "@\/database";/' src/modules/patient-booking/services/patient-booking.service.ts

# Update Scheduling Services
sed -i 's/import { DatabaseService } from .\/..\/auth\/services\/database.service./import { SchedulingRepository } from "@\/database";/' src/modules/scheduling/scheduling.module.ts
for file in src/modules/scheduling/services/*.service.ts; do
  sed -i 's/import { DatabaseService } from .\/..\/..\/auth\/services\/database.service./import { SchedulingRepository } from "@\/database";/' "$file"
done