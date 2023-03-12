import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://rqechictkuaydahokxpn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZWNoaWN0a3VheWRhaG9reHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg1NDIyNTQsImV4cCI6MTk5NDExODI1NH0._8dFzAKiPBe0sX-bIfgeAU5Zvuk5Q8o8Ju69uH957iQ"
);
