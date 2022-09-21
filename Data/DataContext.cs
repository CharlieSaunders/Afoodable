using System;
using Microsoft.EntityFrameworkCore;

namespace Afoodable.Data
{
    public sealed class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }
    }
}
