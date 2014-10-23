include seurat::rpm_manager

include seurat::developer::frontend
Class['seurat::rpm_manager'] -> Class['seurat::developer::frontend']

include seurat::build_server
Class['seurat::rpm_manager'] -> Class['seurat::build_server']

group { 'seurat':
  ensure => present,
}

$users = [
  'apache'
]
user { $users:
  ensure => present,
  gid => 'seurat',
  shell => '/sbin/nologin',
  require => [ Group['seurat'] ],
}
