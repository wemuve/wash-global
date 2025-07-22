-- Let's test the exact insert that's failing to see what happens
DO $$
BEGIN
  -- This will help us see exactly what's happening
  INSERT INTO public.bookings (
    service_id, package_id, customer_name, customer_phone, 
    customer_address, scheduled_date, scheduled_time, total_amount, user_id
  ) VALUES (
    'cf58ee0d-bb5f-422f-bc81-02a718df8fbd',
    '44a10881-b06d-4e20-a7b8-0f8080a0b416',
    'Test Guest User',
    '+1234567890',
    'Test Address',
    '2025-07-30',
    '12:00:00',
    1040,
    NULL
  );
  
  RAISE NOTICE 'Insert successful!';
EXCEPTION 
  WHEN OTHERS THEN
    RAISE NOTICE 'Insert failed: %', SQLERRM;
END $$;