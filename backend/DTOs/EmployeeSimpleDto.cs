using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs
{
    public class EmployeeSimpleDto
    {
        public int? Id { get; set; }
        public string FullName { get; set; }
        //public string FirstName { get; set; }
        //public string LastName { get; set; }
    }
}
