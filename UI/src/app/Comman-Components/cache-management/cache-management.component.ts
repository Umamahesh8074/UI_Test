import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { CacheManagementService } from 'src/app/Services/CommanService/cache-management.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cache-management',
  templateUrl: './cache-management.component.html',
  styleUrls: ['./cache-management.component.css'],
})
export class CacheManagementComponent {
  cacheKeys: string[] = [];
  filteredCacheKeys = new MatTableDataSource<string>(this.cacheKeys);
  displayedColumns: string[] = ['key', 'actions'];
  totalItems = 0;
  pageSize = 10;
  pageSizeOptions = pageSizeOptions;
  searchTerm: string = '';
  pageIndex: number = 0;
  constructor(private cacheService: CacheManagementService) {}

  ngOnInit(): void {
    this.loadCacheKeys();
  }

  loadCacheKeys(): void {
    this.cacheService.getAllKeys().subscribe(
      (keys: string[]) => {
        this.cacheKeys = keys;
        this.totalItems = keys.length;
        this.filteredCacheKeys.data = this.cacheKeys.slice(0, this.pageSize);
      },
      (error) => console.error('Error loading cache keys', error)
    );
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm; // Store the current search term
    if (searchTerm.trim()) {
      // Filter the cache keys based on search term
      this.filteredCacheKeys.data = this.cacheKeys.filter((key) =>
        key.toLowerCase().includes(searchTerm.toLowerCase())
      );
      this.totalItems = this.filteredCacheKeys.data.length; // Update total items after filtering
      // Reset pagination to the first page after filtering
      this.pageIndex = 0;
    } else {
      // If search term is empty, reset to the full list and the current page
      this.loadCacheKeys(); // Reload the original list
    }
  }

  clearCache(key: string, event: Event): void {
    event.stopPropagation(); // Stop the click from propagating to the parent row
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete cache key: ${key}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#004869',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cacheService.clearCacheKey(key).subscribe(() => {
          Swal.fire('Deleted!', 'The cache key has been cleared.', 'success');
          this.loadCacheKeys();
        });
      }
    });
  }

  clearAllCache(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will clear all cache keys!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#004869',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear all!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cacheKeys = [];
        this.filteredCacheKeys.data = [];
        this.totalItems = 0;
        this.cacheService.clearAllCache().subscribe(() => {
          Swal.fire('Deleted!', 'All cache keys have been cleared.', 'success');
          this.loadCacheKeys();
        });
      }
    });
  }

  onPageChange(event: any): void {
    const { pageIndex, pageSize } = event;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.filteredCacheKeys.data = this.cacheKeys.slice(startIndex, endIndex);
  }

  viewKeyDetails(key: string): void {
    // Show loading spinner while waiting for the backend response

    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while we fetch the data.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Fetch cache value from the service
    this.cacheService.getCacheValue(key).subscribe({
      next: (cacheValue: any) => {
        Swal.close();
        // Format and display the cache value in a readable format
        let formattedCacheValue: string;

        // Check if the value is an object or array and format accordingly
        if (typeof cacheValue === 'object' && cacheValue !== null) {
          formattedCacheValue = `<pre style="text-align: left; white-space: pre-wrap; font-family: Consolas, monospace; background-color: #f5f5f5; padding: 10px;">${JSON.stringify(
            cacheValue,
            null,
            2
          )}</pre>`;
        } else {
          formattedCacheValue = `<p>${cacheValue}</p>`;
        }

        // Open SweetAlert with the formatted cache value
        Swal.fire({
          title: `Cache Data for Key: ${key}`,
          html: formattedCacheValue,
          width: '60%',
          confirmButtonColor: '#004869',
          showCloseButton: true,
          preConfirm: () => {
            return true;
          },
        });
      },
      error: (error: any) => {
        Swal.fire('Error', 'Failed to fetch data for this key.', 'error');
      },
    });
  }
}
